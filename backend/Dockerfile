# Use the official Node.js 20 lightweight Alpine base image
FROM node:20-alpine AS base

# Install pnpm package manager globally
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies only using pnpm
RUN pnpm install --frozen-lockfile --prod

# Copy the server configuration and codebase
COPY knexfile.js ./
COPY src/ ./src
COPY .env.example ./

# Expose the default gateway API port
EXPOSE 5000

# Set environment variables for production execution
ENV NODE_ENV=production
ENV PORT=5000

# Execute server boot command
CMD ["pnpm", "start"]
