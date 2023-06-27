# Web Engineering Project 2023
Project implementation for the class "Web Engineering 1" held by Spörl.
Neither the frontend nor the backend especially is intended for deployment in a
production environment.


## Installation

Start the backend service via 
```bash
docker run -p 8080:8080 ghcr.io/hfxbse/web-engineering-2023-fileservice:latest
```
and the frontend server via
```bash
docker run -p <any port you like>:80 ghcr.io/hfxbse/web-engineering-2023-fileservice:latest
```

As an alternative you can build the docker images locally, but if you choose to do so,
I assume you know how to that.
