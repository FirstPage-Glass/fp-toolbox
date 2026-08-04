import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  distDir: 'dist',
  output: 'standalone', // Coolify/Docker: self-contained server build
  // Pin the file-tracing root to this project — otherwise standalone
  // mirrors the host's absolute path (pnpm-workspace.yaml confuses it).
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
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
