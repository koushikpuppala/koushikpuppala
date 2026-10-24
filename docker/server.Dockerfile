# Authoritative NestJS API. Build from the repository root:
#   docker build -f docker/server.Dockerfile -t koushikpuppala/server .
# Settings come from the root .env file, copied into the server (dotenv) and Prisma (prisma.config.ts).
# The entrypoint applies pending migrations before the server starts.

# Use the Node.js LTS Alpine image as the base image for the build
FROM node:lts-alpine AS base

# Enable Corepack, which installs the pnpm version pinned in package.json "packageManager"
RUN corepack enable

# Keep Corepack's pnpm in a shared location, so a non-root runtime user can use it without a download
# (the server entrypoint runs migrations through pnpm)
ENV COREPACK_HOME=/usr/local/share/corepack \
  COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Install dependencies for building native modules
RUN apk add --no-cache libc6-compat curl bash

# Set the working directory to /app
WORKDIR /app

# Create a new stage called "dependencies" based on the "base" image
FROM base AS dependencies

# Copy all the files to the working directory
COPY . .

# Prune the server project to remove unnecessary files (node_modules is not in the build context,
# so Turbo runs through pnpm dlx, pinned to the version in the root package.json)
RUN pnpm dlx turbo@2.11.7 prune server --docker

# Create a new stage called "builder" based on the "base" image
FROM base AS builder

# Copy .gitignore file to the working directory
COPY .gitignore .gitignore

# Copy package management files to the working directory
COPY --from=dependencies /app/out/json/ .

# Copy pnpm-lock.yaml and pnpm-workspace.yaml files to the working directory
COPY --from=dependencies /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=dependencies /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy the pnpm settings (node linker, peer dependencies) to the working directory
COPY .npmrc .npmrc

# Install project dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files to the working directory
COPY --from=dependencies /app/out/full/ .

# Copy the .env file to the server and Prisma project directories
COPY .env ./apps/server/.env
COPY .env ./packages/prisma/.env

# Copy the turbo.json file to the working directory
COPY turbo.json turbo.json

# Generate Prisma client code for the database
RUN pnpm --filter @repo/prisma db:generate

# Build the application using pnpm
RUN pnpm exec turbo build --filter=server...

# Create a new stage called "runner" based on the "base" image
FROM base AS runner

# Set the environment variables for production mode on port 8080
ENV NODE_ENV=production \
  PORT=8080

# Create a new system group with GID 1001
RUN addgroup --system --gid 1001 koushikpuppala && \
  # Create a new system user with UID 1001 and add it to the "koushikpuppala" group
  adduser --system --uid 1001 portfolio --ingroup koushikpuppala

# Copy the built application files from the "builder" stage to the "runner" stage
COPY --from=builder --chown=portfolio:koushikpuppala /app .

# Install the pinned pnpm into the shared Corepack cache, used by the entrypoint's migration step
RUN corepack install

# Copy the entrypoint script to the root directory of the container and set its permissions to be executable
COPY --chmod=755 docker/entrypoint.server.sh /entrypoint.sh

# Switch to the "portfolio" user
USER portfolio

# Expose port 8080 for the application
EXPOSE 8080

# Mark the container unhealthy when the API stops answering
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -fsS http://127.0.0.1:${PORT}/api/health || exit 1

# Set the working directory to the server project directory
WORKDIR /app/apps/server

# Set the entrypoint for the container to the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
