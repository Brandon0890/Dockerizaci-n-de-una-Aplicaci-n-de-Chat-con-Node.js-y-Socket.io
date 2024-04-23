# Backend
FROM node:14 AS backend

WORKDIR /app/server

COPY server/package*.json ./

RUN npm install

COPY server .

# Frontend
FROM node:14 AS frontend

WORKDIR /app/client

COPY client/package*.json ./

RUN npm install

COPY client .

# Combinar backend y frontend
FROM node:14

WORKDIR /app

COPY --from=backend /app/server /app/server
COPY --from=frontend /app/client /app/client

CMD ["node", "server/server.js"]
