# Backend Dockerfile for QuickCart
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy application code (includes node_modules from Jenkins)
COPY . .

# Expose the port
EXPOSE 5000

# Start the server with auto-seeding
CMD ["node", "docker-startup.js"]
