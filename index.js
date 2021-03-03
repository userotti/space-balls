const http = require("http");
const createSocketIo = require('socket.io');
const kickoff = require("./loop");
const httpRequestHandler = require("./httpRequestHandler");
const game = require('./game.js');



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


//Do the setup with World stuff
game.gameInit(io);

//Create the loop function by calling kickoff 
const loop = kickoff(game.gameLoopCallback);

//Kick off the whole thing
loop();