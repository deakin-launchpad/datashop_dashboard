# base image
FROM node:14-alpine as build

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package*.json ./
ADD package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
RUN npm install -g serve

# Bundle app source
COPY . .

# Create Build
RUN npm run build

# Specify port
EXPOSE 3000

# start app
CMD ["serve", "-s", "build", "-l", "3000"]