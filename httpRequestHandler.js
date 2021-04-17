
var fs = require('fs');  
const game = require('./game.js');
const querystring = require('querystring');
var finalhandler = require('finalhandler')

//Main request handler
module.exports = function (req, res) {
  
  console.log("req.url", req.url);
  console.log("req.url.split('?')[0]", req.url.split('?')[0]);
  console.log("req.method",req.method);
  
  
  switch (req.url.split('?')[0]) {
    case "/createplayer":

      const queryObject = querystring.parse(req.url.split('?')[1]);
      
      console.log("queryObject: ", queryObject);
      if (queryObject['username'] && queryObject['username'].length){
        
        const newguy = game.addUser(queryObject['username']);
        console.log("newguy: ", newguy);
        res.writeHead(302,
          {Location: '/index.html?userId='+newguy.uuid}
        );
        res.end();
        
      } else {
        res.writeHead(302,
          {Location: '/newgame.html'}
        );
        res.end();
      }
      
      
    break;
  }  


};