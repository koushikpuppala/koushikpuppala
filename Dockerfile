FROM --platform=$TARGETPLATFORM node:lts-alpine AS base

FROM base AS dependencies

RUN corepack enable

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install

FROM base AS builder

RUN corepack enable

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

ENV ENVIRONMENT=production

RUN yarn build

FROM base AS runner

RUN apk add --no-cache curl bash

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

CMD node server.js
