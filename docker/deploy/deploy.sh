#!/bin/bash
# Deploys one app from inside its folder on EC2 (~/services/portfolio/<app>), by hand or from the
# deploy workflow. The folder name picks the app; the tag is the one CI pushed to ECR.
#   ECR_REGISTRY=... ECR_REPOSITORY=... AWS_REGION=... ./deploy.sh 22-10-2026v1
#   ./deploy.sh rollback      (server and client: switch back to the previous slot)
#
# server and client deploy blue-green: the new tag starts in the idle slot, nginx switches to it once
# it is healthy, and the old slot is stopped (kept for rollback). admin is replaced in place.

set -euo pipefail

APP=$(basename "$PWD")

case "$APP" in
  server) BLUE_PORT=8090 GREEN_PORT=8091 ;;
  client) BLUE_PORT=3010 GREEN_PORT=3011 ;;
  admin) BLUE_PORT='' GREEN_PORT='' ;;
  *)
    echo "❌ Run this from ~/services/portfolio/<server|client|admin>, not $PWD"
    exit 1
    ;;
esac

if [ -z "${1:-}" ]; then
  echo "❌ IMAGE_TAG is required"
  echo
  echo "Usage:"
  echo "  ./deploy.sh 22-10-2026v1"
  echo "  ./deploy.sh rollback"
  exit 1
fi

for NAME in ECR_REGISTRY ECR_REPOSITORY AWS_REGION; do
  if [ -z "${!NAME:-}" ]; then
    echo "❌ Missing environment variable: $NAME"
    exit 1
  fi
done

if [ ! -f app.env ]; then
  echo "❌ Missing app.env in $PWD (the image holds no settings)"
  exit 1
fi

# A placeholder is not empty, so the app's own required-setting checks would let it start.
if grep -n '<fill:' app.env; then
  echo "❌ app.env still has the <fill: ...> placeholders above"
  exit 1
fi

export ECR_REGISTRY ECR_REPOSITORY

login() {
  echo "🔐 Logging into ECR..."
  aws ecr get-login-password --region "$AWS_REGION" |
    docker login --username AWS --password-stdin "$ECR_REGISTRY"
}

# --wait returns once the image's HEALTHCHECK reports healthy; the server's only does after its
# entrypoint has applied database migrations.
start() {
  if ! docker compose "$@" up -d --wait --wait-timeout 180; then
    echo "❌ $APP did not become healthy"
    docker compose "$@" logs --tail 100
    docker compose "$@" stop
    exit 1
  fi
}

if [ -z "$BLUE_PORT" ]; then
  export IMAGE_TAG="$1"
  echo "🚀 Deploying $APP $IMAGE_TAG"
  login
  docker compose pull
  start
  docker compose ps
  echo "✅ $APP is running $IMAGE_TAG"
  exit 0
fi

UPSTREAM="/etc/nginx/portfolio/$APP.conf"
ACTIVE=$(cat .active-slot 2>/dev/null || true)
other() { if [ "$1" = blue ]; then echo green; else echo blue; fi; }
port() { if [ "$1" = blue ]; then echo "$BLUE_PORT"; else echo "$GREEN_PORT"; fi; }
project() { echo "portfolio-$APP-$1"; }

if [ "$1" = rollback ]; then
  if [ -z "$ACTIVE" ] || [ ! -f ".tag-$(other "$ACTIVE")" ]; then
    echo "❌ No previous slot to roll back to"
    exit 1
  fi
  TARGET=$(other "$ACTIVE")
  export IMAGE_TAG
  IMAGE_TAG=$(cat ".tag-$TARGET")
  echo "⏪ Rolling $APP back to $TARGET ($IMAGE_TAG)"
else
  TARGET=$(other "${ACTIVE:-green}")
  export IMAGE_TAG="$1"
  echo "🚀 Deploying $APP $IMAGE_TAG to $TARGET"
  login
fi

export SLOT="$TARGET" PORT
PORT=$(port "$TARGET")

[ "$1" = rollback ] || docker compose -p "$(project "$TARGET")" pull
start -p "$(project "$TARGET")"

# nginx -t checks the new upstream before the reload; a failure restores the old one and leaves the
# live slot serving.
echo "🔀 Switching nginx to $TARGET (127.0.0.1:$PORT)..."
[ -f "$UPSTREAM" ] && cp "$UPSTREAM" "$UPSTREAM.previous"
printf 'server 127.0.0.1:%s;\n' "$PORT" > "$UPSTREAM"
if ! sudo -n nginx -t; then
  [ -f "$UPSTREAM.previous" ] && mv "$UPSTREAM.previous" "$UPSTREAM"
  docker compose -p "$(project "$TARGET")" stop
  echo "❌ nginx rejected the new upstream; $APP stays on ${ACTIVE:-nothing}"
  exit 1
fi
sudo -n systemctl reload nginx

echo "$TARGET" > .active-slot
echo "$IMAGE_TAG" > ".tag-$TARGET"

# Let requests already on the old slot finish, then stop it. It is kept (not removed) for rollback.
if [ -n "$ACTIVE" ] && [ "$ACTIVE" != "$TARGET" ]; then
  sleep 10
  SLOT="$ACTIVE" PORT=$(port "$ACTIVE") IMAGE_TAG=$(cat ".tag-$ACTIVE" 2>/dev/null || echo "$IMAGE_TAG") \
    docker compose -p "$(project "$ACTIVE")" stop
fi

docker ps --filter "name=portfolio-$APP"
echo "✅ $APP is live on $TARGET with $IMAGE_TAG"
