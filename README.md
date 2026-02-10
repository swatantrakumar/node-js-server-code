# node-js-server-code


docker run -d \
  --name node-js-server \
  -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=27017 \
  -e DB_NAME=central-elabs-prod \
  -e DB_USER=admin \
  -e DB_PASSWORD=admin123 \
  swatantrakumarthakuar/node-js-server-code:latest