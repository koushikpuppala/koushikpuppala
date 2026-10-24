#!/bin/sh
# Reads the full .env on stdin and prints only the lines the named app reads, so the internet facing
# Next.js apps never hold the database, Firebase admin or Redis credentials. The server reads nearly
# every key and gets the whole file. Usage: env-for.sh <client|admin|server> <build|run>
set -eu

APP=${1:?app name required}
STAGE=${2:?build or run required}

case "$APP" in
  server)
    cat
    exit 0
    ;;
  client)
    KEYS='NEXT_PUBLIC_BASE_URL|API_INTERNAL_URL|NEXT_PUBLIC_DEPLOY_URL|NEXT_PUBLIC_CLIENT_SENTRY_DSN|NEXT_PUBLIC_GOOGLE_ANALYTICS|NEXT_PUBLIC_MICROSOFT_CLARITY|NEXT_PUBLIC_RECAPTCHA_SITE_KEY|CDN_URL|REVALIDATE_SECRET|SENTRY_ORG|SENTRY_CLIENT_PROJECT'
    ;;
  admin)
    KEYS='NEXT_PUBLIC_BASE_URL|NEXT_PUBLIC_DEPLOY_URL|NEXT_PUBLIC_ADMIN_SENTRY_DSN|NEXT_PUBLIC_FIREBASE_[A-Z_]+|CDN_URL|AWS_REGION|S3_BUCKET|SENTRY_ORG|SENTRY_ADMIN_PROJECT'
    ;;
  *)
    echo "Unknown app: $APP" >&2
    exit 1
    ;;
esac

# The Sentry token only uploads source maps during the build, so a running container never needs it.
if [ "$STAGE" = build ]; then KEYS="$KEYS|SENTRY_AUTH_TOKEN"; fi

grep -E "^($KEYS)[[:space:]]*=" || true
