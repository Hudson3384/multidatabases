```DOCKER
docker run \
    --name postgres \
    -e POSTGRES_USER="hudson" \
    -e POSTGRES_PASSWORD="senha" \
    -e POSTGRES_DB="admin" \
    -p 5432:5432 \
    -d \
    postgres
```

```
docker ps 
```

```
docker exec -it postgres /bin/bash 
```

```
docker run \
 --name adminer \
 -p 8080:8080 \
 --link postgres:postgres \
 -d \
 adminer 
 ```
```
docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO-INITDB_ROOT_USERNAME=admin \
    -e MONGO-INITDB_ROOT_PASSWORD=admin \
    -d \
    mongo:4
```
```
docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient
```
```
docker exec -it mongodb \
    mongo --host localhost -u hudson -p senha --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user: 'admin2', pwd 'senha', roles: [{role: 'readWrite', db: 'herois'}]})"
```
