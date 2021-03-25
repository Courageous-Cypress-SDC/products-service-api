FROM node:14

# create app directory
RUN mkdir -p usr/src/app
WORKDIR usr/src/app

# set node env
ENV NODE_ENV=production


COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production


COPY . .
EXPOSE 3005

CMD [ "npm", "server/server.js" ]
