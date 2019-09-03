FROM node:10.16.3-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY .env ./

RUN npm install

COPY . .

CMD ["npm", "start"]