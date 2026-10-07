# =========================
# Stage 1: Build React app
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Upgrade OS packages in build stage to patch security vulnerabilities (e.g., CVE-2026-XXXXX)
RUN apk update && apk upgrade --no-cache

# Use the pnpm version required by the project
RUN corepack enable && corepack prepare pnpm@12.6.0 --activate

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy workspace package manifests
COPY apps/web/package.json ./apps/web/package.json
COPY packages/api-client/package.json ./packages/api-client/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy web application source/configuration.
# Do NOT copy apps/web/node_modules.
COPY apps/web/src ./apps/web/src
COPY apps/web/public ./apps/web/public
COPY apps/web/index.html ./apps/web/index.html
COPY apps/web/tsconfig.json ./apps/web/tsconfig.json
COPY apps/web/vite.config.ts ./apps/web/vite.config.ts

# Copy shared packages source
COPY packages ./packages

# Build web app
RUN pnpm --filter web build


# =========================
# Stage 2: Production server
# =========================
FROM nginx:alpine

# Upgrade runtime Alpine packages to clear CVE-2026-XXXXX and other OS vulnerabilities
RUN apk update && apk upgrade --no-cache

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Cloud Run listens on port 8080
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]