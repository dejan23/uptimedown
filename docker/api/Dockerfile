# Create builder to compile and build react app
FROM node:11

# Setup workd directory
WORKDIR "/app"

# Copy package.json
COPY api/package.json ./

# Install all needed packages
RUN npm install

# Copy all files to be used
COPY api/ .


EXPOSE 3000

# Start up
CMD ["npm", "run", "start"]