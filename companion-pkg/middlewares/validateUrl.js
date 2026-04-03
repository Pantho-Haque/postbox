import { ALLOWED_HOSTNAMES } from "../config.js";

export function validateUrl(req, res, next) {
  const { url, method = "GET", headers = {}, body } = req.body;

  const uppercase_method = method.toUpperCase();
  // ── Validate URL ────────────────────────────────────────────────────────────
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: `Invalid URL: ${url}` });
  }

  if (!ALLOWED_HOSTNAMES.includes(parsed.hostname)) {
    return res.status(403).json({
      error: `Blocked: only localhost URLs allowed, got ${parsed.hostname}`,
    });
  }

  // ── Parse Headers ───────────────────────────────────────────────────────────
  let parsedHeaders = {};
  try {
    parsedHeaders = typeof headers === "string" ? JSON.parse(headers) : headers;
  } catch {
    return res
      .status(400)
      .json({ error: "Invalid headers — must be valid JSON" });
  }

  // ── Parse Body ──────────────────────────────────────────────────────────────
  let parsedBody = undefined;
  if (!["GET", "HEAD"].includes(uppercase_method) && body) {
    try {
      parsedBody = typeof body === "string" ? body : JSON.stringify(body);
    } catch {
      return res.status(400).json({ error: "Invalid body" });
    }
  }

  req.body = {
    url,
    method: uppercase_method,
    headers: parsedHeaders,
    body: parsedBody,
  };
  next();
}
