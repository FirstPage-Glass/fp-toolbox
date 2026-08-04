# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# --- deps ---
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN COREPACK_ENABLE_DOWNLOAD_PROMPT=0 pnpm install --frozen-lockfile

# --- build ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN COREPACK_ENABLE_DOWNLOAD_PROMPT=0 pnpm build

# --- run (standalone) ---
FROM base AS runner
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=builder /app/dist/standalone ./
# static chunks + public assets are not included in the standalone trace
COPY --from=builder /app/dist/static ./dist/static
COPY --from=builder /app/public ./public
EXPOSE 3000
# ponytail: HOSTNAME set at exec time — the container runtime overwrites the ENV value with the container id
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]
