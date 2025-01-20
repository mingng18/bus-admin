# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . ./

# Expose the port Vite uses in development mode
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
