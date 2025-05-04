# Build React app
FROM node:22-alpine AS react-client-builder
WORKDIR /app
COPY ../frontend ./frontend
RUN cd frontend && npm install && npm run build

# Set up Express server
FROM node:22-alpine
WORKDIR /app
COPY ../backend ./backend
RUN cd frontend && npm install

EXPOSE 5000
CMD ["node", "server.js"]
