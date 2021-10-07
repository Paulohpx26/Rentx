# Rentx
🚗 Sample REST API built with NodeJS, Express and TypeORM

## Running Locally
Change configs in "ormconfig.json". 

Create the database locally.

```sh
# install dependencies
yarn

# start the server
yarn dev
```
## Running server and database with docker
Change configs in "docker-compose.yml"

```sh
# create a docker container with application and database
docker-compose up

# if server stops
docker-compose start
```

## Running migrations and seeds
```sh
# Running migrations
yarn typeorm migration:run

# Running admin seed
yarn seed:admin
```

The application is running on port 3333.
Access http://localhost:3333/api-docs/ for documentation and tests.
