FROM node:10

WORKDIR /app

ARG DB_URL

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000
CMD [ "npm", "start" ]


