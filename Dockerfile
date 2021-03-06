FROM node:carbon

WORKDIR /usr/src/app

COPY . .

RUN yarn

EXPOSE 8080

CMD ["yarn", "start"]
