# Use Node.js LTS (Long Term Support) version on Alpine Linux for a lightweight image
FROM node:20-alpine

# Set environment variable to production by default
ENV NODE_ENV=production

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache for dependencies
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the application port (8080 as per config)
EXPOSE 8080

# Use a non-root user for security
USER node

# Command to run the application
CMD ["node", "index.js"]
