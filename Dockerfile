FROM node:12-alpine

# add bash for dev
RUN apk add --no-cache bash

RUN mkdir /app
WORKDIR /app

ARG APP_URL=https://dot.texastribune.org
ARG AUTH0_DOMAIN=auth.texastribune.org
ARG AUTH0_CLIENT_ID=Xlu6vBtvb2e2UjpVmHwPKe7nKA8NJknB

COPY package.json /app/
COPY package-lock.json /app/
RUN npm i

COPY . /app/

RUN npm run build

ENTRYPOINT ["npm", "start"]
