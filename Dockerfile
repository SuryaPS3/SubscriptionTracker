FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD["npm", "run", "dev"]

Expose PORT:3000