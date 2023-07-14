FROM node:18.6-alpine3.16
WORKDIR /app
COPY package*.json /app
RUN npm ci
COPY . /app
EXPOSE 8080
RUN npm run build
CMD [ "serve" ,"-s", "build"]