FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --production

COPY server/ ./server/
COPY admin/ ./admin/
COPY public/ ./public/

RUN mkdir -p /app/public/uploads

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server/server.js"]
