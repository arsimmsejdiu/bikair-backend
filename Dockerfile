#Normal build
FROM node:16-alpine
#for arm64 build (Rpi)
#FROM arm64v8/node:16-alpine

RUN apk add --no-cache \
  python3 \
  openjdk11 \
  py-pip \
  py-setuptools \
  ca-certificates \
  groff \
  less \
  curl \
  bash && \
  pip install --no-cache-dir --upgrade pip awscli

RUN npm config set prefix /usr/local \
    && npm install -g npm@latest \
    && npm install -g serverless \
    && npm install -g typescript

ENTRYPOINT ["/bin/bash", "-c"]
