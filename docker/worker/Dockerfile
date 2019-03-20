# Create builder to compile and build react app
FROM node:11

# Setup workd directory
WORKDIR "/app"

# Copy package.json
COPY worker/package.json ./

# Install all needed packages
RUN npm install

# Copy all files to be used
COPY worker/ .

# Start up
CMD ["npm", "run", "start"]