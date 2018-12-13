FROM node:6.11.1
MAINTAINER tech@texastribune.org

RUN mkdir /app
WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/
RUN yarn

COPY . /app/

# RUN yarn run dash:prod:webpack

ENTRYPOINT ["/app/docker-entrypoint.sh"]
