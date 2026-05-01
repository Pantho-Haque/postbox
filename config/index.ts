const config = {
  api: {
    host: process.env.NEXT_API_BASE_URL,
    clientSecret: process.env.NEXT_API_CLIENT_SECRET,
  },
};

export const EXTENSION_URL =
  "https://github.com/Pantho-Haque/hittable/releases/latest/download/hittable-extension.zip";

export default config;