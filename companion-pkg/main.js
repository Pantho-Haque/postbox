import express from "express";
import cors from "cors";    
import rateLimit from "express-rate-limit";

import { authMiddleware } from "./middlewares/auth.js";
import { validateUrl } from "./middlewares/validateUrl.js";
import { ALLOWED_ORIGINS, PORT, TOKEN } from "./config.js";

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error(`Origin ${origin} not allowed`));
    },
  }),
);

app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { error: "Too many requests — slow down" },
  }),
);

// ─── Routes  ──────────────────────────────────────────────────────────────────────
app.post("/establish-connection", (req, res) => {
    const {token} = req.body;
    if(token !== TOKEN){
        return res.status(401).json({ error: "Invalid or missing token" });
    }
    console.log("Connected to ", req.baseUrl);
    res.json({ success: true, token: TOKEN });
});

// Proxy — auth required
app.post("/proxy", authMiddleware, validateUrl, async (req, res) => {
  const { url, method = "GET", headers = {}, body } = req.body;

  // ── Fetch ───────────────────────────────────────────────────────────────────
  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    let data;
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return res.json({
      data,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: responseHeaders,
    });
  } catch (err) {
    return res.status(502).json({
      error: `Failed to reach ${url} — is your local server running?`,
      detail: err.message,
    });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("\n┌─────────────────────────────────────────┐");
  console.log("│       Postbox Companion  v1.0.0         │");
  console.log("└─────────────────────────────────────────┘");
  console.log(`\n  Listening on  → http://localhost:${PORT}`);
  console.log(`\n  Paste this token into Postbox:\n`);
  console.log(`  ${TOKEN}\n`);
  console.log("  Keep this terminal open while using Postbox.");
  console.log("  Press Ctrl+C to stop.\n");
});
