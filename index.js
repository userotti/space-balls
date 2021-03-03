const http = require("http");
var url = require('url');  
const createSocketIo = require('socket.io');

const World = require('index-ecs').World;
const kickoff = require("./loop");
const httpRequestHandler = require("./httpRequestHandler");

gameInit = ()=>{
  
}

//Regiter my main game callback
gameLoopCallback = (delta)=>{
  console.log("do game stuff, delta: ", delta);
}

//Create the loop function by calling kickoff 
const loop = kickoff(gameLoopCallback);

//Kick off the whole thing
loop();

const host = 'localhost';
const port = 8000;

//Build the server
const server = http.createServer(httpRequestHandler);
const io = createSocketIo(server);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
});
