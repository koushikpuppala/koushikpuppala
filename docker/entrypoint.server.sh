#!/bin/sh
set -e

echo "Running Prisma migrations..."
# The Prisma CLI is called directly because pnpm would need Corepack, which Node 25+ images do not
# ship.
cd /app/packages/prisma
./node_modules/.bin/prisma migrate deploy

echo "Starting server..."
cd /app/apps/server
exec node dist/main.js
