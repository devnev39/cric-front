FROM node:18.6-alpine3.16
RUN apk update && apk add bash
WORKDIR /app
COPY package*.json /app
RUN npm i -g serve
RUN npm ci
COPY . /app
EXPOSE 8080
RUN npm run build
CMD [ "serve" ,"-l","8080","-s", "build"]

