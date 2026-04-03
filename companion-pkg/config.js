import crypto from "crypto";

export const TOKEN = crypto.randomBytes(32).toString("hex");
export const PORT = 7700;
export const ALLOWED_ORIGINS = [
  "https://postbox-pantho.vercel.app",
  "http://localhost:3000",
];
export const ALLOWED_HOSTNAMES = ["localhost", "127.0.0.1", "0.0.0.0"];