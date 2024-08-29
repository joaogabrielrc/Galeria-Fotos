FROM node:20.16-alpine

WORKDIR /usr/src/app

RUN apk update

COPY package.json package-lock.json ./
COPY tsconfig.json ./

RUN ["npm", "install"]

COPY . .

CMD ["npm", "start"]
