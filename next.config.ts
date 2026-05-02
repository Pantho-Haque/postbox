import { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "domiknows.vercel.app",
      },
    ],
    qualities: [25, 50, 75, 100],
  }, 
};

export default nextConfig;
