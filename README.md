
[![Publish Docker Images](https://github.com/just4give/telegram-block/actions/workflows/docker-push.yml/badge.svg)](https://github.com/just4give/telegram-block/actions/workflows/docker-push.yml)

A block to integrate your balena application with telegram bot 

<img width="762" alt="Screen Shot 2021-11-11 at 11 47 56 AM" src="https://user-images.githubusercontent.com/9275193/141336529-0093134d-34ab-4f1e-9362-3aeaeace545d.png">

## Pre-requisite
Of course you need to create a telegram bot first before you can integrate with your application 😀 
If you don't know how, follow this [link](https://core.telegram.org/bots#3-how-do-i-create-a-bot) for instructions.
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
    environment:
            - TG_TOKEN=<your_telegram_token>
            - TG_CHAT_ID=<your_telegram_chat_id>
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
    environment:
            - TG_TOKEN=<your_telegram_token>
            - TG_CHAT_ID=<your_telegram_chat_id>

```

_Dockerfile_

```dockerfile
FROM mithundotdas/telegram-block:%%BALENA_ARCH%%
```

`mithundotdas/telegram-block` is built for the following archs:

- `aarch64`
- `armv7hf`
- `amd64`
- `rpi`

## Communication
Telegram block starts a MQTT broker on port 1883 (configurable). Your application communicates through the MQTT topics. Sample code which sends "pong" message to telegram app when any message is sent to the bot. To send any message (text, photo or audio), you need to send data to /tg/tx topic. To receive message from telegram, you need to listen to topic /tg/rx

```javascript

const mqtt = require('mqtt');
const port = 1883;

const username = process.env.MQTT_USER;
const password = process.env.MQTT_PASSWORD;

const client = mqtt.connect(`mqtt://localhost:${port}`,{username: username, password: password});

  client.on('connect', function () {
    console.log(`connected to telegram block`);
    client.subscribe('/tg/rx');
    
  })

  client.on('message', function (topic, message) {
    
    client.publish('/tg/tx',  JSON.stringify({type:"text",text: "pong"}));
  })

  client.on('error', function (error) {
    console.log(error);
    
  })
```

Supported types are 
- text
- photo
- audio

TX message format 

```json
{
  "type":"text",
  "text":"hello"
}

{
  "type":"photo",
  "photo":"/var/media/image.png"  //from local volume
}

{
  "type":"photo",
  "photo":"https://github.com/just4give/telegram-block/blob/6571079b983fe918867b113ec5c5c74cb99dc5b9/logo.png" //from absolute url
}

{
  "type":"audio",
  "photo":"/var/media/audio.wav"  //from local volume
}

```

## Customization


`mithundotdas/telegram-block` can be configured via the following variables:

| Environment Variable    | Default                             | Description                                                           |
| ----------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| `TG_BROKER_USERNAME`    | `balena`                            | MQTT broker username                                                  |
| `TG_BROKER_PASSWORD`    | `balena`                            | MQTT broker password                                                  |
| `TG_BROKER_PORT`        | `1883`                              | MQTT broker port                                                      |
| `TG_TOEKN`              |                                     | Telegram token. You must supply in docker-compose or variable         |
| `TG_CHAT_ID`            |                                     | Telegram chat id. You must supply in docker-compose or variable       |
| `TG_SEND_TOPIC`         | `/tg/tx`                            | MQTT Topic where you send data for it to be sent to the telegram      |
| `TG_RECEIVE_TOPIC`      | `/tg/rx`                            | Subscribe to this MQTT topic to receive messages sent from telegram   |


You can refer to the [docs](https://www.balena.io/docs/learn/manage/serv-vars/#environment-and-service-variables) on how to set environment or service variables

Alternatively, you can set them in the `docker-compose.yml` or `Dockerfile.template` files.
