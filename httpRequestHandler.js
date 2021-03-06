var fs = require('fs');  

//Main request handler
module.exports = function (req, res) {
  console.log("req.url: ", req.url);
  console.log("req.url.includes('socket'): ", req.url.includes('socket'));

  if (req.url.includes('socket')){
      fs.readFile('./node_modules/socket.io/client-dist/socket.io.js', function(error, data) {  
      if (error) {  
        res.writeHead(404);  
        res.write(error);  
        res.end();  
      } else {

        console.log("data: ", data.length);

        res.writeHead(200, {  
          'Content-Type': 'application/javascript'  
        });
        res.write(data);  
        res.end();  
      }  
    });
  } else {
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
  }

  
};