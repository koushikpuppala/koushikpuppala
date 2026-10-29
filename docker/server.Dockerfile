# Authoritative NestJS API. Build from the repository root:
#   docker build -f docker/server.Dockerfile --secret id=env,src=.env -t koushikpuppala/server .
# The build reads its settings from the `env` BuildKit secret, which never lands in an image layer or
# the build cache, and the image holds no settings. Mount them at runtime for the server (dotenv) and
# Prisma (prisma.config.ts):
#   docker run -v /path/to/server.env:/app/apps/server/.env:ro \
#     -v /path/to/server.env:/app/packages/prisma/.env:ro koushikpuppala/server
# docker/deploy/server/ holds the compose file and deploy.sh used on EC2.
# The entrypoint applies pending migrations before the server starts.

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

# Install project dependencies using pnpm. pnpm-workspace.yaml approves a package's agent skills, and pnpm
# fails without a folder to link them into; turbo prune leaves the repo's skill folders out of the image.
RUN mkdir -p .claude/skills .agents/skills && pnpm install --frozen-lockfile

# Copy the rest of the application files to the working directory
COPY --from=dependencies /app/out/full/ .

# Copy the turbo.json file to the working directory
COPY turbo.json turbo.json

# Generate Prisma client code and build the application, with the settings mounted as a secret
# (prisma.config.ts refuses to load without DATABASE_URL)
RUN --mount=type=secret,id=env,target=/app/apps/server/.env,required=true \
  --mount=type=secret,id=env,target=/app/packages/prisma/.env,required=true \
  pnpm --filter @repo/prisma db:generate && \
  pnpm exec turbo build --filter=server... && \
  rm -rf .turbo

# Drop build and test tooling so the runtime image carries only production dependencies (the prisma
# CLI stays, as a dependency of @repo/prisma, for the entrypoint's migrations)
RUN pnpm prune --prod --ignore-scripts

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

# Remove the base image's npm, which nothing runs and which carries its own vulnerable dependencies
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

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
