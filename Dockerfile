FROM --platform=$TARGETPLATFORM node:lts-alpine

RUN corepack enable

RUN apk add --no-cache curl bash

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start"]
