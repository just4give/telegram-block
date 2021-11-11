const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const mqtt = require('mqtt');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TG_TOKEN
const chatId = process.env.TG_CHAT_ID
const port = process.env.TG_PORT || 1883;
const username = process.env.TG_BROKER_USERNAME || 'balena';
const password = process.env.TG_BROKER_PASSWORD || 'balena';

const bot = new TelegramBot(token, {polling: true});

const allowedTypes = ["text","photo","audio"];
process.env["NTBA_FIX_350"] = 1;

server.listen(port, function () {
  console.log('mqtt broker started and listening on port ', port)
  const client = mqtt.connect(`mqtt://localhost:${port}`,{username: username, password: password});

    client.on('connect', function () {
        client.subscribe('/tg/tx');
    })

    client.on('message', function (topic, message) {

      try {
        if(topic === "/tg/tx"){
            
            let jsonMessage = JSON.parse(message.toString());
            if(!allowedTypes.includes(jsonMessage.type)){
                console.error(`only suppored types are ${allowedTypes.join(",")}`);
                return;
            }
            switch(jsonMessage.type){
                case 'text':
                    bot.sendMessage(chatId, jsonMessage.text).catch(err => { console.error(err); });
                    break;
                case 'photo':
                    bot.sendPhoto(chatId, jsonMessage.photo).catch(err => { console.error(err); });
                    break;
                case 'audio':
                    bot.sendAudio(chatId, jsonMessage.audio).catch(err => { console.error(err); });
                    break;
            }
            
        }
      } catch (error) {
          console.error(error);
      }
   
  });
  
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        
        if(msg.chat.id === chatId && msg.text){
            client.publish('/tg/rx', msg.text);
        }
   
    });
  
})

aedes.authenticate = function (client, uname, pword, callback) {
    if(username === uname && password === pword.toString()){
        
        callback(null, true);
    }else{
        callback(null, false);
    }
    
  }

aedes.on('client', function (client) {
    console.log('client connected: ' + (client ? client.id : client) , 'to broker', aedes.id);

})


aedes.on('clientDisconnect', function (client) {
console.log('client disconnected: ' + (client ? client.id : client) , 'to broker', aedes.id)
})
