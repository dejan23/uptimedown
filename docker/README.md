Uptimedown Docker environment
==================================

# Setup #

Create and configure `.env` file to match your requirements in `docker` folder, you can use `.env.example` as a guide.

Build the images using `docker-compose build`, and start the project using `docker-compose up -d`.

Your environment should now have all dependencies needed, and your service should be available on the web.

Keep note that this docker environment consists of two containers/services, first is `client` which is only used to build production files that second container/service `nginx` uses to host your files on the web.

It's completely normal that `client` services shuts down after completing the build process.

#### Short version ####

```
docker-compose build
docker-compose up -d
```

##### Note #####

Make sure your docker isn't running as `root`.

Also node_modules folder is only visible inside the container.

# Logs #

All logs for nginx will be shown in `logs` folder.

Each log file will be subject to log rotation.

# Updating the code #

Updating your code is easily done with:
```
docker-compose up client
```
This will start client service that will rebuild production files and put it in `production` folder so nginx can host it.

# Docker compose cheatsheet #

**Note:** you need to cd first to where your docker-compose.yml file lives.

  * Start containers in the background: `docker-compose up -d`
  * Start containers on the foreground: `docker-compose up`. You will see a stream of logs for every container running.
  * Stop containers: `docker-compose stop`
  * Kill containers: `docker-compose kill`
  * View container logs: `docker-compose logs`
 
