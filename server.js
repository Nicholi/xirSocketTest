const http = require('http');
const https = require('https');

const Express = require('express');
const ExpressWs = require('express-uws');

let isSecure = false;

let app = Express();

let httpServer;
if (isSecure) {
  let httpsOptions = {};
  httpServer = https.createServer(httpsOptions, app);
} else {
  httpServer = http.createServer(app);
}

function verifyWsClient (info, cb) {
  console.log('Received upgrade request');
  cb(true, null, null);
  return;
}

let expressWsOptions = {
  wsOptions: {
    verifyClient: verifyWsClient 
  }
};
let expressWsResult = ExpressWs(app, httpServer, expressWsOptions);

let wss = expressWsResult.getWss(); 

app.get('/app', (req, res) => {
  console.log('Received http request');
  res.send('Hello World: HTTP');
});

app.ws('/ws', (ws, req) => {
  console.log('Received ws connection');
  ws.on('message', (msg) => {
    console.log('Received ws request');
    ws.send('Hello World: WS');
  });
});

app.use(Express.static('public'));

httpServer.listen(process.env['PORT'], () => {
  console.log('Listening for connections');
});

