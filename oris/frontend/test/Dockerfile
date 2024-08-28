# Use Node.js as the base image
FROM node:latest AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Use a lightweight web server image like Nginx to serve the Angular app
FROM nginx:alpine

# Copy the built app from the builder stage to the nginx public directory
COPY --from=builder /app/dist/frontend /usr/share/nginx/html/

# Set the default nginx server configuration to serve the Angular application
COPY nginx.conf /etc/nginx/conf.d/default.conf
