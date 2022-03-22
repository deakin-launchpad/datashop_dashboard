# base image
FROM node:16-alpine as build

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Add Nginx Conf file 
COPY  thedatashop.club.conf /usr/src/app/ 


# install and cache app dependencies
COPY . .

RUN npm install --silent
RUN npm install -g serve

# Create Build
RUN npm run build

# Specify port
# EXPOSE 3000

#setup nginx
# RUN sudo dnf -y install nginx
# RUN sudo systemctl enable --now nginx.service

# Specify port
EXPOSE 80 443 22
# start app
# RUN sudo systemctl restart nginx
CMD ["serve", "-l", "3000", "-s", "build"]
