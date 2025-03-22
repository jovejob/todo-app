# Use official Node.js image as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build the Vue app
RUN npm run build

# Serve with a simple static server
RUN npm install -g serve

# Expose port
EXPOSE 8080

# Serve the built app
CMD ["serve", "-s", "dist"]
