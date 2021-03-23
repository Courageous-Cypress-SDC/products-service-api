FROM node:14

# set node env
ENV NODE_ENV=production

# create app directory
WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . .
EXPOSE 3005

CMD [ "node", "server.js" ]