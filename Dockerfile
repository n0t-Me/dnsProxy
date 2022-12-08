FROM node:16

WORKDIR /srv/app/

COPY . .

RUN npm install

ENV YES_ITS_NODE_DOCKER true

EXPOSE 53

CMD ["node", "./index.js"]
