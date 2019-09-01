FROM alpine:latest

RUN echo http://dl-cdn.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories

RUN apk update
RUN apk add --no-cache --update \
    gdal-dev \
    gdal \
    nodejs \
    nodejs-npm \
    inotify-tools\
    && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

CMD ["npm", "start"]

