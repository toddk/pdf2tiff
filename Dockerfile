FROM fedora:28

RUN yum install -y \
    gdal \
    nodejs \
    inotify-tools

WORKDIR /usr/src/app

RUN mkdir -p /usr/data/in
RUN mkdir -p /usr/data/out

COPY package*.json ./
COPY scripts/*.sh ./scripts/

RUN npm install

RUN npm install -g nodemon

COPY . .

CMD ["npm", "start"]

