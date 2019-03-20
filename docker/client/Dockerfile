# Create builder to compile and build react app
FROM node:alpine

# Setup workd directory
WORKDIR '/app'

# Copy package.json
COPY client/package.json ./

# Install all needed packages
RUN npm install

# Copy all files to be used
COPY client/ .

# Start up
CMD npm run build:prod && rm -rf /app/production/* && cp -r /app/public/* /app/production
