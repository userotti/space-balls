const http = require("http");
const createSocketIo = require('socket.io');
const kickoff = require("./loop");
const httpRequestHandler = require("./httpRequestHandler");
const serveStatic = require('serve-static')
const game = require('./game.js');
var finalhandler = require('finalhandler')


const host = '0.0.0.0';
const port = '8001';


//Build the server
var serve = serveStatic('public', {
  'setHeaders': (res, path) => {
    if (path.includes('.html')){
      res.setHeader('Content-Type', 'text/html');
    }
  }
})


const server = http.createServer(function onRequest (req, res) {

  httpRequestHandler(req, res);

  serve(req, res, ()=>{
    console.log("I dont care!");
  });
});

const io = createSocketIo(server);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
  
});


//Do the setup with World stuff
game.gameInit(io);

//Create the loop function by calling kickoff 
const loop = kickoff(game.gameLoopCallback);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('fire', (message) => {
    console.log('Fire!: ', message);
    game.fire(message);
  });

});



//Kick off the whole thing
loop();
