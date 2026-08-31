import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  distDir: 'dist',
  output: 'standalone', // Coolify/Docker: self-contained server build
  // Pin the file-tracing root to this project — otherwise standalone
  // mirrors the host's absolute path (pnpm-workspace.yaml confuses it).
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  // ponytail: NC 16 dev fs-cache lives under dist/ (distDir) which the dev
  // watcher also watches → self-triggered recompile/reload loop + cache
  // corruption on this mount. Disable it for dev; prod build unaffected.
  experimental: { turbopackFileSystemCacheForDev: false },
};

export default nextConfig;
