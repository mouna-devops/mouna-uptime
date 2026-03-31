FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 2345

CMD ["npm", "run", "start"]