# Use the node:lts-alpine image as the base image for the build
FROM node:lts-alpine AS base

# Create a new stage called "dependencies" based on the "base" image
FROM base AS dependencies

# Enable Corepack, which provides a consistent way to manage package managers
RUN corepack enable

# Install compatibility libraries
RUN apk add --no-cache libc6-compat

# Set the working directory to /app
WORKDIR /app

# Copy package management files to the working directory
COPY package.json yarn.lock .yarnrc.yml ./

# Install project dependencies using Yarn
RUN yarn install

# Create a new stage called "builder" based on the "base" image
FROM base AS builder

# Enable Corepack again in the builder stage
RUN corepack enable

# Install compatibility libraries
RUN apk add --no-cache libc6-compat

# Set the working directory to /app
WORKDIR /app

# Copy installed node_modules from the "dependencies" stage to the current working directory
COPY --from=dependencies /app/node_modules ./node_modules

# Copy the rest of the application files to the working directory
COPY . .

# Set the environment variable to production
ENV ENVIRONMENT=production

# Build the application using Yarn
RUN yarn build

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
    # Create a directory for the Next.js build output
    mkdir .next && \
    # Change the ownership of the .next directory to the "portfolio" user and "koushikpuppala" group
    chown portfolio:koushikpuppala .next

# Copy the public directory from the "builder" stage to the current working directory
COPY --from=builder /app/public ./public

# Copy the standalone build output from the "builder" stage to the current working directory, with proper ownership
COPY --from=builder --chown=portfolio:koushikpuppala /app/.next/standalone ./

# Copy the static build output from the "builder" stage to the .next/static directory, with proper ownership
COPY --from=builder --chown=portfolio:koushikpuppala /app/.next/static ./.next/static

# Switch to the "portfolio" user
USER portfolio

# Expose port 3000 for the application
EXPOSE 3000

# Set the PORT environment variable to 3000
ENV PORT=3000

# Start the application using Node.js
CMD ["node", "server.js"]
