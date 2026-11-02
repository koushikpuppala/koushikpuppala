# Pin the Node major on the ECR public mirror, so a floating tag cannot break the build or hit Docker Hub limits
FROM public.ecr.aws/docker/library/node:26-alpine AS base

# Install native module libraries, curl for the health check and bash for scripts
RUN apk add --no-cache libc6-compat curl bash

# Set the working directory for every stage built on base
WORKDIR /app

# Start the build-only stage, so pnpm never reaches the runner
FROM base AS tooling

# Install pnpm from npm at the packageManager version, because Node 25+ no longer bundles Corepack
RUN npm install --global pnpm@12.16.1

# Start the stage that reduces the monorepo to what the admin needs
FROM tooling AS dependencies

# Copy the repository into the stage, minus the .dockerignore entries
COPY . .

# Prune the monorepo to the admin, running Turbo through pnpm dlx because node_modules is not in the context
# Keep in step with the turbo version in the root package.json.
RUN pnpm dlx turbo@2.11.10 prune admin --docker

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

# Make next.config.ts emit the standalone output the runner uses
ENV ENVIRONMENT=docker

# Accept the release ID from the build, so Next.js can tell old and new releases apart during a blue-green swap
ARG DEPLOYMENT_ID

# Stamp the release ID into every asset and navigation request
ENV NEXT_DEPLOYMENT_ID=$DEPLOYMENT_ID

# Generate the Prisma client the shared types import, with a throwaway URL because generate never connects
RUN DATABASE_URL=postgresql://unused:unused@localhost:5432/unused pnpm --filter @repo/prisma db:generate

# Build with the settings mounted as a secret, then remove the .env copies from the output and the Turbo cache
RUN --mount=type=secret,id=env,target=/app/apps/admin/.env,required=true \
  pnpm exec turbo build --filter=admin... && \
  rm -rf .turbo apps/admin/.next/standalone/apps/admin/.env

# Start the final stage from base, so it holds neither pnpm nor the build tools
FROM base AS runner

# Listen on every interface on port 3001
ENV HOSTNAME=0.0.0.0 \
  PORT=3001

# Create the non-root user and drop the base image's npm, which the server never runs and which has vulnerabilities
RUN addgroup --system --gid 1001 koushikpuppala && \
  adduser --system --uid 1001 portfolio --ingroup koushikpuppala && \
  rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Copy the standalone server and its traced dependencies from the builder
COPY --from=builder --chown=portfolio:koushikpuppala /app/apps/admin/.next/standalone ./

# Copy the static assets, which the standalone output leaves out
COPY --from=builder --chown=portfolio:koushikpuppala /app/apps/admin/.next/static ./apps/admin/.next/static

# Run as the non-root user from here on
USER portfolio

# Document the port the server listens on
EXPOSE 3001

# Mark the container unhealthy when the app stops answering
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:${PORT}/api/health || exit 1

# Run from the admin folder, where the standalone output places server.js
WORKDIR /app/apps/admin

# Start the standalone Next.js server
CMD ["node", "server.js"]
