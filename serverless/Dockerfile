# Use an official Node.js runtime as a parent image
FROM node:21.5.0

# Set the working directory in the container
WORKDIR /serverless

# Copy the local package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Install Serverless globally
RUN npm install -g serverless

# Install Serverless Offline plugin globally
RUN npm install -g serverless-offline

# Expose the port used by Serverless (if needed)
EXPOSE 3000

# Command to run your application
CMD ["serverless", "offline"]
