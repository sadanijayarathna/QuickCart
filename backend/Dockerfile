# Backend Dockerfile for QuickCart
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies in the container (builds native modules for Linux)
RUN npm install

# Copy application code (node_modules excluded via .dockerignore)
COPY . .

# Expose the port
EXPOSE 5000

# Start the server with auto-seeding
CMD ["node", "docker-startup.js"]
