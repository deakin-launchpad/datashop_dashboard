# pull official base image
FROM node:16-alpine


# set working directory
WORKDIR /build

# Copies package.json and package-lock.json to Docker environment
#COPY package*.json ./

# Installs all node packages
#RUN npm install

# Copies everything over to Docker environment
COPY build .

# Build for production.
#RUN npm run build --production

# Install `serve` to run the application.
RUN npm install -g serve

# Uses port which is used by the actual application
EXPOSE 8080

# Run application
#CMD [ "npm", "start" ]
#WORKDIR /build/web

CMD serve -l 8080 