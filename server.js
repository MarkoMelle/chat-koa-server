const http = require('http');
const Koa = require('koa');
const url = require('url');
const {koaBody} = require('koa-body');
const cors = require('@koa/cors');
const WS = require('ws');
const fs = require('fs');
const {chat, usernames} = require('./db');
const router = require('./routes');
require('events').EventEmitter.defaultMaxListeners = Infinity; 
const app = new Koa();

app.use(cors());
app.use(koaBody({
  urlencoded: true,
}));

app.use(router());

const port = 7070;
const server = http.createServer(app.callback());

const wsServer = new WS.Server({
  server,
});

wsServer.on('connection', (ws, req) => {
  const parameters = url.parse(req.url, true);
  ws.name = parameters.query
  ws.on('message', (event) => {
    const messageData = JSON.parse(new TextDecoder().decode(event));
    chat.add(messageData);
    const eventData = JSON.stringify({
      dataType: 'message',
      message: messageData,
    });
    Array.from(wsServer.clients)
        .filter((client) => client.readyState === WS.OPEN)
        .forEach((client) => client.send(eventData));
  });
  fs.watchFile('./db/usernames.json', () => {
    ws.send(JSON.stringify({dataType: 'usernames', usernames: usernames.data}));
  });
  ws.send(JSON.stringify({dataType: 'usernames', usernames: usernames.data}));
  ws.send(JSON.stringify({dataType: 'messages', messages: chat.data}));
  ws.on('close', ()=> {
    usernames.delete(ws.name)
  })
  // setInterval(()=>Array.from(wsServer.clients).forEach(client=>{
  //   console.log('Client.ID: ' + client.name)
  // }),5000)
});


server.listen(port, (error) => {
  if (error) {
    throw new Error(error);
  }
  console.log('listening on port', port);
});


