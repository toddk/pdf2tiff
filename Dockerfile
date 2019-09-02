FROM alpine:latest

RUN echo http://dl-cdn.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories

RUN apk update
RUN apk add --no-cache --update \
    bash \
    openrc \
    gdal-dev \
    gdal \
    nodejs \
    nodejs-npm \
    inotify-tools\
    && rm -rf /var/cache/apk/*

RUN mkdir -p /usr/src/app/in
RUN mkdir -p /usr/src/app/out

WORKDIR /usr/src/app

COPY package*.json ./
COPY scripts/*.sh ./

RUN npm install

RUN npm install -g nodemon

COPY . .

CMD ["npm", "start"]

