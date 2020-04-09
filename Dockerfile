FROM node:12-stretch

RUN mkdir /app
WORKDIR /app

ARG API_HOST=https://dot.texastribune.org

COPY package.json /app/
COPY yarn.lock /app/
RUN yarn

COPY . /app/

# RUN npm run build-dashboard

ENTRYPOINT ["/app/docker-entrypoint.sh"]
