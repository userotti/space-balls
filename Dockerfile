FROM node:14-alpine

WORKDIR /usr/app

COPY package.json .

RUN npm i --quiet

EXPOSE 8001

COPY . .

CMD ["node", "server.js"]