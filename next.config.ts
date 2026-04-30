import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: 'dist',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nocodb.firstpage.com.hk',
      },
    ],
    qualities: [75],
  },
};

export default nextConfig;
