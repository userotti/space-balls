const http = require("http");
const createSocketIo = require('socket.io');
const kickoff = require("./loop");
const httpRequestHandler = require("./httpRequestHandler");
const serveStatic = require('serve-static')
const game = require('./game.js');



const host = 'localhost';
const port = 8000;

//Build the server
var serve = serveStatic('public', { 'index': ['index.html', 'index.htm'] })

const server = http.createServer(function onRequest (req, res) {
  serve(req, res, httpRequestHandler(req, res))
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
  });

});



//Kick off the whole thing
loop();


/*
var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')
 
// Serve up public/ftp folder
var serve = serveStatic('public/ftp', { 'index': ['index.html', 'index.htm'] })
 
// Create server
var server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})
 
// Listen
server.listen(3000)
*/
