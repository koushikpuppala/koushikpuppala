#!/bin/sh
set -e

echo "Running Prisma migrations..."
pnpm --filter @repo/prisma db:migrate:deploy

echo "Starting server..."
exec node dist/main.js
