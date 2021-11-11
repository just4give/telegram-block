
[![Publish Docker Images](https://github.com/just4give/telegram-block/actions/workflows/docke-push.yml/badge.svg)](https://github.com/just4give/telegram-block/actions/workflows/docke-push.yml)

<img width="762" alt="Screen Shot 2021-11-11 at 11 47 56 AM" src="https://user-images.githubusercontent.com/9275193/141336529-0093134d-34ab-4f1e-9362-3aeaeace545d.png">

## Usage

#### docker-compose file

To use this image, create a container in your `docker-compose.yml` file as shown below:

```yaml
version: "2.1"

volumes:
  shared-media:

services:
  telegram-block:
    image: mithundotdas/telegram-block:armv7hf
    restart: always
    network_mode: host
    volumes: 
            - 'shared-media:/var/media'
```

You can set your `docker-compose.yml` to build a `Dockerfile` file and use the dashboard block as the base image.
_docker-compose.yml:_

```yaml
version: "2"

volumes:
  shared-media:

services:
  telegram-block:
    build: ./
    restart: always
    network_mode: host
    volumes: 
            - 'shared-media:/var/media'

```

_Dockerfile_

```dockerfile
FROM mithundotdas/telegram-block:%%BALENA_ARCH%%
```


