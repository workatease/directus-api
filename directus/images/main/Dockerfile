#
# Builder
#

FROM node:14-alpine AS builder

ARG VERSION

RUN \
  apk update && \
  apk upgrade && \
  apk add bash

SHELL ["/bin/bash", "-c"]

WORKDIR /directus

COPY package.json .

RUN cat package.json

#
# Image
#
FROM node:14-alpine

RUN \
  apk update && \
  apk upgrade && \
  apk add bash ssmtp util-linux

SHELL ["/bin/bash", "-c"]

WORKDIR /directus

# Global requirements
RUN npm install -g yargs pino pino-colada

# Install Directus
COPY --from=builder /directus/package.json .
RUN npm install

# Copy files
COPY ./directus/images/main/rootfs /
# Keep the updated package.json
COPY --from=builder /directus/package.json .

RUN chmod +x /usr/bin/entrypoint && chmod +x /usr/bin/print

# Create directories
RUN \
  mkdir -p extensions/displays && \
  mkdir -p extensions/interfaces && \
  mkdir -p extensions/layouts && \
  mkdir -p extensions/modules && \
  mkdir -p database && \
  mkdir -p uploads

EXPOSE 8055

ENTRYPOINT ["entrypoint"]
