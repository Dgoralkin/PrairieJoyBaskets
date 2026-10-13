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

# Install pnpm (matches the version used in the repo)
RUN corepack enable && corepack prepare pnpm@12.6.0 --activate

# Copy just the files needed for dependency installation
COPY apps/api/package.json pnpm-lock.yaml
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
# Stage 2 – Runtime image (small, production‑only)
# -------------------------------------------------
FROM node:22-alpine AS runtime

# Create a non‑root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Copy only the compiled output and runtime deps from the builder
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json .
COPY --from=builder /app/node_modules ./node_modules  

# Expose the port Cloud Run expects (default 8080)
EXPOSE 8080

# Environment variable for the listening port
ENV PORT=8080

# Start the API
CMD ["node", "dist/index.js"]
