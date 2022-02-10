FROM node:10
WORKDIR /usr/app
COPY ./src .
RUN npm install
EXPOSE 3000