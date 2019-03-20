# Create nginx server to serve production
FROM nginx:1.11

# Install logrotate
RUN apt-get update && apt-get -y install nginx logrotate

# Copy logrotate nginx script
COPY nginx.logrotate /etc/logrotate.d/nginx

# Start nginx and cron as a service
CMD service cron start && nginx -g 'daemon off;'
