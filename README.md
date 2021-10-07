# Rentx
:barber: Sample API REST built with NodeJS, Express and Sequelize

## Running Locally
Change configs in "ormconfig.json". 

Create the database locally.

```sh
yarn

# start the server
yarn dev
```
## Running server and database with docker
Change configs in "docker-compose.yml"

```sh
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
