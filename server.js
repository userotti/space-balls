const http = require("http");
const createSocketIo = require('socket.io');
const kickoff = require("./loop");
const httpRequestHandler = require("./httpRequestHandler");
const serveStatic = require('serve-static')
const game = require('./game.js');
var finalhandler = require('finalhandler')
const querystring = require('querystring');

const host = '0.0.0.0';
const port = '8001';


//Build the server
var serve = serveStatic('public', {
  
})


const server = http.createServer(function onRequest (req, res) {

  httpRequestHandler(req, res);

  serve(req, res, (e)=>{
    console.log("I dont care!:", e);
  });

  
});

const io = createSocketIo(server);

server.listen(port, host, () => {
  console.log(`Server is up @ http://${host}:${port}`);
  
});


//Do the setup with World stuff
game.gameInit(io);

//Create the loop function by calling kickoff 
const loop = kickoff(game.gameLoopCallback);

io.on('connection', (socket) => {

  const queryObject = querystring.parse(socket.handshake.headers.referer.split('?')[1]);
  console.log('a user userId', queryObject['userId']);

  if (queryObject['userId'] && game.userIdCheck(queryObject['userId'])){
    for (let connectionId of socket.rooms.keys()) {
      game.linkUserIdWithConnectionId(queryObject['userId'], connectionId)
      game.sendScoreUpdate();
    }
  }

  socket.on('disconnecting', () => {
    for (let connectionId of socket.rooms.keys()) {
      if (!!game.getPlayerByConnectionId(connectionId)){
        game.removeUserWithConnectionId(connectionId)  
        game.sendScoreUpdate();
      }
    }
  });
  
  socket.on('fire', (data) => {
    for (let connectionId of socket.rooms.keys()) {
      game.fire({connectionId, ...data});
    }
    
  });

  socket.on('chat', (data) => {
    for (let connectionId of socket.rooms.keys()) {
      game.chat({connectionId, ...data});
    }
  });

});



//Kick off the whole thing
loop();
