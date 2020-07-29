FROM node:14.6.0
LABEL maintainer="Texas Tribune <tech@texastribune.org>"

RUN mkdir /app
WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/
RUN yarn

COPY . /app/

# RUN yarn run dash:prod:webpack

ENTRYPOINT ["/app/docker-entrypoint.sh"]
