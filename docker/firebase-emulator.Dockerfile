# Firebase Auth emulator for the integration and end to end tests (docker-compose.test.yml).
# The Auth emulator runs on Node.js, so no Java is needed (only the Firestore, Database, Storage and
# Pub/Sub emulators are Java programs). Build from the repository root:
#   docker build -f docker/firebase-emulator.Dockerfile -t koushikpuppala/firebase-emulator .

# Node 24 on Alpine, the same major as CI. Not the moving lts tag: Node 25 and later images no longer ship
# Corepack, so `corepack enable` below fails the build once that tag moves past 24.
FROM node:24-alpine AS base

# Install curl for the health check and tini so the emulator stops as soon as the container does
RUN apk add --no-cache curl tini

# Set the working directory to /app
WORKDIR /app

# Create a new stage called "dependencies" based on the "base" image
FROM base AS dependencies

# Version of the Firebase CLI, which contains the Auth emulator
ARG FIREBASE_TOOLS_VERSION=15.31.0

# Install the Firebase CLI into its own directory, without the npm cache, so only it is copied on
RUN npm install --prefix /opt/firebase-tools --omit=dev --no-audit --no-fund \
  firebase-tools@${FIREBASE_TOOLS_VERSION} && \
  npm cache clean --force

# Create a new stage called "runner" based on the "base" image
FROM base AS runner

# Put the Firebase CLI on the PATH and turn off its update check and prompts
ENV PATH=/opt/firebase-tools/node_modules/.bin:$PATH \
  NO_UPDATE_NOTIFIER=1 \
  CI=true

# Create a new system group with GID 1001
RUN addgroup --system --gid 1001 koushikpuppala && \
  # Create a new system user with UID 1001 and add it to the "koushikpuppala" group
  adduser --system --uid 1001 portfolio --ingroup koushikpuppala && \
  # Let the user write the emulator's debug log in the working directory
  chown portfolio:koushikpuppala /app

# Copy the Firebase CLI from the "dependencies" stage to the current stage
COPY --from=dependencies /opt/firebase-tools /opt/firebase-tools

# Copy the emulator configuration (host, port, no UI) to the working directory, with proper ownership
COPY --chown=portfolio:koushikpuppala firebase.json firebase.json

# Switch to the "portfolio" user
USER portfolio

# Expose port 9099 for the Auth emulator
EXPOSE 9099

# Mark the container unhealthy when the emulator stops answering
HEALTHCHECK --interval=5s --timeout=3s --start-period=30s --retries=10 \
  CMD curl -fsS http://127.0.0.1:9099/ || exit 1

# Run the emulator under tini, which forwards stop signals and reaps child processes
ENTRYPOINT ["/sbin/tini", "--"]

# demo-* project IDs run fully offline and need no Google credentials
CMD ["firebase", "emulators:start", "--only", "auth", "--project", "demo-koushikpuppala"]
