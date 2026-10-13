# =========================
# This file is used to containerize the API backend for CI/CD pipeline deployment on Google Cloud Run via Cloud Build.
# It uses a multi-stage build to first build the API backend and then serve it using Node.js.
# =========================

# -------------------------------------------------
# Stage 1 – Build the API (Node + TypeScript)
# -------------------------------------------------
FROM node:22-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Upgrade OS packages in build stage to patch security vulnerabilities (e.g., CVE-2026-XXXXX)
RUN apk update && apk upgrade --no-cache

# Install pnpm (matches the version used in the repo)
RUN corepack enable && corepack prepare pnpm@12.6.0 --activate

# Copy root workspace config files (required by pnpm to resolve the monorepo)
COPY package.json pnpm-workspace.yaml ./

# Copy the lockfile
COPY pnpm-lock.yaml ./

# Copy each workspace package's package.json for dependency caching
COPY apps/api/package.json apps/api/
COPY packages/types/package.json packages/types/
COPY packages/api-client/package.json packages/api-client/
COPY packages/tsconfig/package.json packages/tsconfig/

# Install all dependencies (including workspace packages)
RUN pnpm install --frozen-lockfile

# Copy the API source code
COPY apps/api ./apps/api
COPY packages ./packages

# Build the TypeScript source (produces ./dist)
RUN pnpm --filter api run build

# Use pnpm deploy to create a self-contained production bundle.
# This resolves all workspace:* deps, copies only prod node_modules,
# and requires no symlinks — safe to copy into a fresh image.
RUN pnpm deploy --filter api --prod /deploy/api

# Copy the compiled dist into the deploy bundle (deploy only copies node_modules + package.json)
RUN cp -r /app/apps/api/dist /deploy/api/dist

# -------------------------------------------------
# Stage 2 – Runtime image (small, production-only)
# -------------------------------------------------
FROM node:22-alpine AS runtime

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy the self-contained deploy bundle from the builder
# Includes: dist/, node_modules/ (prod only, no symlinks), package.json
COPY --from=builder /deploy/api .

# Drop to non-root user
USER appuser

# Expose the port Cloud Run expects (default 8080)
EXPOSE 8080

# Environment variable for the listening port
ENV PORT=8080

# Start the API
CMD ["node", "dist/index.js"]

