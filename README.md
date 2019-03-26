# Multiplayer Pictionary

This repo contains a frontend and backend for a multiplayer Pictionary game. It uses Typescript, Koa, routing-controllers and TypeORM in the backend and React/Redux in the frontend. The backend exposes a REST API but also sends messages over websockets using SocketIO. 

![example](https://gph.is/1pmqlS2)

## Getting Started

### Postgres Database

Start a Postgres container using the following Docker command:

```bash
$ docker run \
  --rm \
  -e POSTGRES_PASSWORD=makeoneup \
  -p 5432:5432 \
  pictionary
```

