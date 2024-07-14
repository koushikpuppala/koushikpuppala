FROM --platform=$TARGETPLATFORM node:lts-slim AS base

FROM base AS dependencies

RUN corepack enable

RUN apt-get update && apt-get install -y libc6 && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install

FROM base AS builder

RUN corepack enable

RUN apt-get update && apt-get install -y libc6 && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

ENV ENVIRONMENT=production

RUN yarn build

FROM base AS runner

RUN apt-get update && apt-get install -y curl bash

WORKDIR /app

RUN addgroup --system --gid 1001 koushikpuppala

RUN adduser --system --uid 1001 portfolio --ingroup koushikpuppala

COPY --from=builder /app/public ./public

RUN mkdir .next

RUN chown portfolio:koushikpuppala .next

COPY --from=builder --chown=portfolio:koushikpuppala /app/.next/standalone ./

COPY --from=builder --chown=portfolio:koushikpuppala /app/.next/static ./.next/static

USER portfolio

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
