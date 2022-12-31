FROM node:18-bullseye-slim as base

WORKDIR /app
RUN apt-get update && apt-get install -y aria2 tini

FROM base as installer

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

FROM base as app

COPY --from=installer /app/node_modules ./node_modules
COPY . ./

ENTRYPOINT ["/usr/bin/tini", "--"]
