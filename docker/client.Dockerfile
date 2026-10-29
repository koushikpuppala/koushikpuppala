# Public portfolio (Next.js standalone). Build from the repository root:
#   docker build -f docker/client.Dockerfile --secret id=env,src=.env -t koushikpuppala/client .
# The build reads its settings from the `env` BuildKit secret, which never lands in an image layer or
# the build cache, and the image holds no settings. Mount them at runtime instead:
#   docker run -v /path/to/client.env:/app/apps/client/.env:ro koushikpuppala/client
# (docker/env-for.sh client run picks this app's keys from the full .env; docker/deploy/client/ holds the
# compose file and deploy.sh used on EC2).

# Node 24 on Alpine, the same major as CI. Not the moving lts tag: Node 25 and later images no longer ship
# Corepack, so `corepack enable` below fails the build once that tag moves past 24.
FROM node:24-alpine AS base

# Enable Corepack, which installs the pnpm version pinned in package.json "packageManager"
RUN corepack enable

# Let Corepack fetch the pinned pnpm without an interactive prompt during the build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Install dependencies for building native modules
RUN apk add --no-cache libc6-compat curl bash

# Set the working directory to /app
WORKDIR /app

# Create a new stage called "dependencies" based on the "base" image
FROM base AS dependencies

# Copy all the files to the working directory
COPY . .

# Prune the client project to remove unnecessary files (node_modules is not in the build context,
# so Turbo runs through pnpm dlx, pinned to the version in the root package.json)
RUN pnpm dlx turbo@2.11.7 prune client --docker

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

# Install project dependencies using pnpm. pnpm-workspace.yaml approves a package's agent skills, and pnpm
# fails without a folder to link them into; turbo prune leaves the repo's skill folders out of the image.
RUN mkdir -p .claude/skills .agents/skills && pnpm install --frozen-lockfile

# Copy the rest of the application files to the working directory
COPY --from=dependencies /app/out/full/ .

# Copy the turbo.json file to the working directory
COPY turbo.json turbo.json

# Set the environment variable of ENVIRONMENT to "docker" for the standalone output (next.config.ts)
ENV ENVIRONMENT=docker

# Generate the Prisma client that the shared types import. prisma.config.ts refuses to load without
# DATABASE_URL, but generate never connects, and this image must not hold the real one.
RUN DATABASE_URL=postgresql://unused:unused@localhost:5432/unused pnpm --filter @repo/prisma db:generate

# Build with the settings mounted as a secret. Next.js copies .env into the standalone output and Turbo
# caches that output, so both are removed in the same step to keep the settings out of the layer.
RUN --mount=type=secret,id=env,target=/app/apps/client/.env,required=true \
  pnpm exec turbo build --filter=client... && \
  rm -rf .turbo apps/client/.next/standalone/apps/client/.env

# Create a new stage called "runner" based on the "base" image
FROM base AS runner

# Set the environment variables for the standalone server (it sets NODE_ENV itself): every interface, port 3000
ENV HOSTNAME=0.0.0.0 \
  PORT=3000

# Create a new system group with GID 1001
RUN addgroup --system --gid 1001 koushikpuppala && \
  # Create a new system user with UID 1001 and add it to the "koushikpuppala" group
  adduser --system --uid 1001 portfolio --ingroup koushikpuppala && \
  # Remove the base image's npm, which the standalone server never runs and which carries its own vulnerable dependencies
  rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Copy the standalone directory from the "builder" stage to the current working directory, with proper ownership
COPY --from=builder --chown=portfolio:koushikpuppala /app/apps/client/.next/standalone ./

# Copy the static directory from the "builder" stage to the apps/client/.next/static directory, with proper ownership
COPY --from=builder --chown=portfolio:koushikpuppala /app/apps/client/.next/static ./apps/client/.next/static

# Copy the public directory from the "builder" stage to the apps/client/public directory, with proper ownership
COPY --from=builder --chown=portfolio:koushikpuppala /app/apps/client/public ./apps/client/public

# Switch to the "portfolio" user
USER portfolio

# Expose port 3000 for the application
EXPOSE 3000

# Mark the container unhealthy when the app stops answering
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:${PORT}/api/health || exit 1

# Set the working directory to the client project directory
WORKDIR /app/apps/client

# Start the application using Node.js
CMD ["node", "server.js"]
