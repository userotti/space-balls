const http = require("http");
var url = require('url');  
var fs = require('fs');  

const World = require('index-ecs').World;
const kickoff = require("./loop");

gameInit = ()=>{
  
}

//Regiter my main game callback
gameLoopCallback = (delta)=>{
  console.log("do game stuff, delta: ", delta);
}

//Create the loop function by calling kickoff 
const loop = kickoff(gameInit, gameLoopCallback);

//Kick off the whole thing
loop();

//Main request handler
const requestListener = function (req, res) {
  fs.readFile('./page.html', function(error, data) {  
      if (error) {  
        res.writeHead(404);  
        res.write(error);  
        res.end();  
      } else {  
        res.writeHead(200, {  
              'Content-Type': 'text/html'  
          });  
        res.write(data);  
        res.end();  
      }  
  });
};


const host = 'localhost';
const port = 8000;

//Build the server
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

