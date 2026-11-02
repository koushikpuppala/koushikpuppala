# Pin the Node major on the ECR public mirror, so a floating tag cannot break the build or hit Docker Hub limits
FROM public.ecr.aws/docker/library/node:26-alpine AS base

# Install native module libraries, curl for the health check and bash for the entrypoint
RUN apk add --no-cache libc6-compat curl bash

# Set the working directory for every stage built on base
WORKDIR /app

# Start the build-only stage, so pnpm never reaches the runner
FROM base AS tooling

# Install pnpm from npm at the packageManager version, because Node 25+ no longer bundles Corepack
RUN npm install --global pnpm@12.16.1

# Start the stage that reduces the monorepo to what the server needs
FROM tooling AS dependencies

# Copy the repository into the stage, minus the .dockerignore entries
COPY . .

# Prune the monorepo to the server, running Turbo through pnpm dlx because node_modules is not in the context
# Keep in step with the turbo version in the root package.json.
RUN pnpm dlx turbo@2.11.10 prune server --docker

# Start the stage that installs dependencies and builds the app
FROM tooling AS builder

# Copy the git ignore rules, pnpm settings and Turbo config the install and build read
COPY .gitignore .npmrc turbo.json ./

# Copy only the package.json files, so the install layer is cached until a dependency changes
COPY --from=dependencies /app/out/json/ .

# Copy the pruned lockfile and workspace definition that the frozen install checks against
COPY --from=dependencies /app/out/pnpm-lock.yaml /app/out/pnpm-workspace.yaml ./

# Install from the lockfile, after creating the skill folders pnpm needs and turbo prune leaves out
RUN mkdir -p .claude/skills .agents/skills && pnpm install --frozen-lockfile

# Copy the pruned source code after the install, so code changes keep the install layer cached
COPY --from=dependencies /app/out/full/ .

# Generate the Prisma client and build the server, with the settings mounted as a secret because prisma.config.ts needs DATABASE_URL
RUN --mount=type=secret,id=env,target=/app/apps/server/.env,required=true \
  --mount=type=secret,id=env,target=/app/packages/prisma/.env,required=true \
  pnpm --filter @repo/prisma db:generate && \
  pnpm exec turbo build --filter=server... && \
  rm -rf .turbo

# Drop build and test tooling, keeping the prisma CLI (a @repo/prisma dependency) for the entrypoint's migrations
RUN pnpm prune --prod --ignore-scripts

# Start the final stage from base, so it holds neither pnpm nor the build tools
FROM base AS runner

# Run in production mode on port 8080
ENV NODE_ENV=production \
  PORT=8080

# Create the non-root user the app runs as
RUN addgroup --system --gid 1001 koushikpuppala && \
  adduser --system --uid 1001 portfolio --ingroup koushikpuppala

# Copy the built workspace with its production dependencies from the builder
COPY --from=builder --chown=portfolio:koushikpuppala /app .

# Drop the base image's npm, which nothing runs and which has vulnerabilities
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Copy the entrypoint that applies pending migrations before the server starts
COPY --chmod=755 docker/entrypoint.server.sh /entrypoint.sh

# Run as the non-root user from here on
USER portfolio

# Document the port the server listens on
EXPOSE 8080

# Mark the container unhealthy when the API stops answering
# start-period covers prisma migrate deploy, which runs before the API listens.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -fsS http://127.0.0.1:${PORT}/api/health || exit 1

# Run from the server folder
WORKDIR /app/apps/server

# Start through the entrypoint, which migrates and then launches the server
ENTRYPOINT ["/entrypoint.sh"]
