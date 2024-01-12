### Run postgres image
```
docker run \
    --name postgres \
    -e POSTGRES_USER="hudson" \
    -e POSTGRES_PASSWORD="senha" \
    -e POSTGRES_DB="admin" \
    -p 5432:5432 \
    -d \
    postgres
```
### See containers running
```
docker ps 
```
### Exec a command inside of a container
```
docker exec -it postgres /bin/bash 
```
### Run adminer image

```
docker run \
 --name adminer \
 -p 8080:8080 \
 --link postgres:postgres \
 -d \
 adminer 

```

### How to connect adminer with postgres 

> Acess the [page](http://localhost:8080)
> Insert the acess infos on .env file 
> Use the container name as server name 

### Run mongodb image
```
docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO-INITDB_ROOT_USERNAME=admin \
    -e MONGO-INITDB_ROOT_PASSWORD=admin \
    -d \
    mongo:4
```
### Run mongoclient image
```
docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient
```
### command to create a user on DB, dont works for me 
```
docker exec -it mongodb \
    mongo --host localhost -u hudson -p senha --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user: 'admin2', pwd 'senha', roles: [{role: 'readWrite', db: 'herois'}]})"
```

All of this was replaced to docker-composer.yml 
```

docker-compose exec -it mongodb mongo --host localhost -u admin -p admin --authenticationDatabase admin --eval "db.getSiblingDB('heros').createUser({user: 'hudson', pwd: 'admin',
roles: [{role: 'readWrite', db: 'heros'}]})"
```
