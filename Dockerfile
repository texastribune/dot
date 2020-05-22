FROM node:12-stretch

RUN mkdir /app
WORKDIR /app

ARG APP_URL=https://dot.texastribune.org

COPY package.json /app/
COPY package-lock.json /app/
RUN npm i

COPY . /app/

RUN npm run build

ENTRYPOINT ["/app/shell/docker-entrypoint.sh"]
