#!/bin/sh
set -e

# The Prisma CLI is called directly rather than through pnpm, which would need Corepack to fetch pnpm's
# native binary at startup: a network call the non-root user cannot cache.
echo "Running Prisma migrations..."
cd /app/packages/prisma
./node_modules/.bin/prisma migrate deploy

echo "Starting server..."
cd /app/apps/server
exec node dist/main.js
