# Use the node:lts-alpine image as the base image for the build
FROM node:lts-alpine AS base

# Enable Corepack, which provides a consistent way to manage package managers
RUN corepack enable && \
    # Install compatibility libraries
    apk add --no-cache libc6-compat

# Create a new stage called "dependencies" based on the "base" image
FROM base AS dependencies

# Set the working directory to /app
WORKDIR /app

# Copy package management files to the working directory
COPY package.json pnpm-lock.yaml .npmrc ./

# Install project dependencies using Yarn
RUN pnpm install

# Create a new stage called "builder" based on the "base" image
FROM base AS builder

# Set the working directory to /app
WORKDIR /app

# Copy installed node_modules from the "dependencies" stage to the current working directory
COPY --from=dependencies /app/node_modules ./node_modules

# Copy the rest of the application files to the working directory
COPY . .

# Set the environment variable of ENVIRONMENT to "docker"
ENV ENVIRONMENT=docker

# Build the application using pnpm
RUN pnpm build && \
    # Remove the cache and clean up the pnpm store to reduce image size
    rm -rf node_modules/.cache && pnpm store prune

# Create a new stage called "runner" based on the "base" image
FROM base AS runner

# Set the working directory to /app
WORKDIR /app

# Install additional packages: curl and bash
RUN apk add --no-cache curl bash && \
    # Create a new system group with GID 1001
    addgroup --system --gid 1001 koushikpuppala && \
    # Create a new system user with UID 1001 and add it to the "koushikpuppala" group
    adduser --system --uid 1001 portfolio --ingroup koushikpuppala && \
    # Create a directory for the Next.js build output and application logs
    mkdir .next logs

# Copy the public directory from the "builder" stage to the current working directory
COPY --from=builder /app/public ./public

# Copy the standalone build output from the "builder" stage to the current working directory
COPY --from=builder /app/.next/standalone ./

# Copy the static build output from the "builder" stage to the .next/static directory
COPY --from=builder /app/.next/static ./.next/static

# Change the ownership of the .next, public, and logs directory to the "portfolio" user and "koushikpuppala" group
RUN chown -R portfolio:koushikpuppala .next public logs

# Switch to the "portfolio" user
USER portfolio

# Expose port 3000 for the application
EXPOSE 3000

# Set the PORT environment variable to 3000
ENV PORT=3000

# Start the application using Node.js
CMD ["node", "server.js"]