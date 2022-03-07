FROM node:12-alpine
LABEL maintainer="Texas Tribune <tech@texastribune.org>"

# add bash for dev
RUN apk add --no-cache bash python2 g++ make

RUN mkdir /app
WORKDIR /app

ARG APP_URL=https://dot.texastribune.org
ARG AUTH0_DOMAIN=auth.texastribune.org
ARG AUTH0_CLIENT_ID=Xlu6vBtvb2e2UjpVmHwPKe7nKA8NJknB
ARG SENTRY_DSN=https://ea2663c9f8084a8892df8fb5559af25e@o197244.ingest.sentry.io/1317454
ARG SENTRY_ENVIRONMENT=production
ARG VUETIFY_NONCE

COPY package.json /app/
COPY package-lock.json /app/
RUN npm i

COPY . /app/

RUN npm run build

ENTRYPOINT ["npm", "start"]
