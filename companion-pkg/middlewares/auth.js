import { TOKEN } from "../config.js";

export function authMiddleware(req, res, next) {
  const token = req.headers["x-companion-token"];
  if (token !== TOKEN) {
    return res.status(401).json({ error: "Invalid or missing token" });
  }
  next();
}