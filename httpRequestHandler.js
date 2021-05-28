
var fs = require('fs');  
const game = require('./game.js');
const querystring = require('querystring');

//Main request handler
module.exports = function (req, res) {
  
  // console.log("req.url", req.url);
  // console.log("req.url.split('?')[0]", req.url.split('?')[0]);
  // console.log("req.method",req.method);
  
  
  switch (req.url.split('?')[0]) {

    case "/index.html": {
      console.log("case hit");
      const queryObject = querystring.parse(req.url.split('?')[1]);
      console.log("game.userIdCheck(queryObject['userId']): ", game.userIdCheck(queryObject['userId']));
      if (queryObject['userId'] && !game.userIdCheck(queryObject['userId'])){
        console.log("redirect????")
        res.writeHead(302,
          {Location: '/newplayer.html'}
        );
        res.end();
      }
      break;
    }

    case "/debug.html": {
      // if (queryObject['userId'] && !game.userIdCheck(queryObject['userId'])){
        console.log('game',JSON.stringify(game))
        res.write(JSON.stringify(game));
        res.end();
      // }
      break;
    }
      
    case "/createplayer": {
      console.log('/createplayer')
      const queryObject = querystring.parse(req.url.split('?')[1]);
      if (queryObject['username'] && queryObject['username'].length){
        
        const newguy = game.addUser(queryObject['username']);
        console.log("newguy: ", newguy);
        res.writeHead(302,
          {Location: '/index.html?userId='+newguy.uuid}
        );
        res.end();
        
      }
      break;
    }

  }  


};