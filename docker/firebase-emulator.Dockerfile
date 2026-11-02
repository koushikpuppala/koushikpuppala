# Pin the Node major on the ECR public mirror, so a floating tag cannot break the build or hit Docker Hub limits
FROM public.ecr.aws/docker/library/node:26-alpine AS base

# Install curl for the health check and tini so the emulator stops as soon as the container does
RUN apk add --no-cache curl tini

# Set the working directory for every stage built on base
WORKDIR /app

# Start the stage that installs the Firebase CLI
FROM base AS dependencies

# Accept the Firebase CLI version, which contains the Auth emulator
ARG FIREBASE_TOOLS_VERSION=15.34.2

# Install the CLI into its own directory without the npm cache, so only it is copied to the runner
RUN npm install --prefix /opt/firebase-tools --omit=dev --no-audit --no-fund \
  firebase-tools@${FIREBASE_TOOLS_VERSION} && \
  npm cache clean --force

# Start the final stage from base, so it holds no install leftovers
FROM base AS runner

# Put the Firebase CLI on the PATH and turn off its update check and prompts
ENV PATH=/opt/firebase-tools/node_modules/.bin:$PATH \
  NO_UPDATE_NOTIFIER=1 \
  CI=true

# Create the non-root user and let it write the emulator's debug log in the working directory
RUN addgroup --system --gid 1001 koushikpuppala && \
  adduser --system --uid 1001 portfolio --ingroup koushikpuppala && \
  chown portfolio:koushikpuppala /app

# Copy the Firebase CLI from the dependencies stage
COPY --from=dependencies /opt/firebase-tools /opt/firebase-tools

# Copy the emulator configuration (host, port, no UI), owned by the app user
COPY --chown=portfolio:koushikpuppala firebase.json firebase.json

# Run as the non-root user from here on
USER portfolio

# Document the Auth emulator port
EXPOSE 9099

# Mark the container unhealthy when the emulator stops answering
HEALTHCHECK --interval=5s --timeout=3s --start-period=30s --retries=10 \
  CMD curl -fsS http://127.0.0.1:9099/ || exit 1

# Run the emulator under tini, which forwards stop signals and reaps child processes
ENTRYPOINT ["/sbin/tini", "--"]

# Start only the Auth emulator, using a demo-* project ID so it runs offline without Google credentials
CMD ["firebase", "emulators:start", "--only", "auth", "--project", "demo-koushikpuppala"]
