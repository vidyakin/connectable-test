# Connectable

### Dockerized version 1.0

------
## Local Dev Env with docker-compose:

- **connfrontend** - Vue.js container service name
- **connbackend** - Node.js container service name
- **mongodb** - MongoDB container service name

### Default URL is http://localhost:8080


#### Deploy full app (FrontEnd + BackEnd + MongoDB)
```
# always create static/public to avoid 500 from API
$ mkdir -p static/public
$ docker-compose up -d

```
#### Stop the app & start again

```
$ docker-compose stop
$ docker-compose start

```

#### Destroy deployment along with Volumes and Images
```
$ docker-compose down --rmi all -v
```

------

## LDE flow example on Frontend changes (Vue.js)


1.Create public/static directories inside repository root
```
$ mkdir -p static/public
```
2.Run docker-compose to get full Connectable application up

```
$ docker-compose up -d
```

3.Make code changes to Vue.js code

4.Rebuild and restart frontend container

```
$ docker-compose build connfrontend
$ docker-compose up --no-deps -d connfrontend
```