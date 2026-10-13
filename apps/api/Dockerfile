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
RUN pnpm --filter api run build   # assumes a "build" script defined in apps/api/package.json

# -------------------------------------------------
# Stage 2 – Runtime image (small, production-only)
# -------------------------------------------------
FROM node:22-alpine AS runtime

# Create a non-root user for security (must be done before switching USER)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only the compiled output and the API's package.json from the builder
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

# Install ONLY production deps with plain npm (avoids broken pnpm symlinks from builder)
# pnpm uses a virtual store with symlinks which break when copied to a fresh image
RUN npm install --omit=dev --ignore-scripts

# Drop to non-root user after installing dependencies
USER appuser

# Expose the port Cloud Run expects (default 8080)
EXPOSE 8080

# Environment variable for the listening port
ENV PORT=8080

# Start the API
CMD ["node", "dist/index.js"]
