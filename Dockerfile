FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy application code
COPY . .

CMD ["npm", "run", "start"]

# Use ARG to make port configurable at build time
ARG PORT=3000
EXPOSE $PORT

