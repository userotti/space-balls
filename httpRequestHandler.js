var fs = require('fs');  

//Main request handler
module.exports = function (req, res) {
  console.log("req.url: ", req.url);
  if (req.url === '/socket.io.js'){
      fs.readFile('./node_modules/socket.io/client-dist/socket.io.js', function(error, data) {  
      if (error) {  
        res.writeHead(404);  
        res.write(error);  
        res.end();  
      } else {  
        res.writeHead(200, {  
          'Content-Type': 'application/javascript'  
        });  
        res.write(data);  
        res.end();  
      }  
    });
  }

  if (req.url === '/socket.io.js.map'){
    fs.readFile('./node_modules/socket.io/client-dist/socket.io.js.map', function(error, data) {  
      if (error) {  
        res.writeHead(404);  
        res.write(error);  
        res.end();  
      } else {  
        res.writeHead(200, {  
          'Content-Type': 'application/json'  
        });  
        res.write(data);  
        res.end();  
      }  
    });
  }

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