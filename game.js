const World = require('index-ecs').World;
const broadcast = require('./systems/broadcast');
const physics = require('./systems/physics');


var world = new World();
var io;

module.exports = {

  gameInit: (_io)=>{
    
    io = _io;
    var player1 = world.createEntity();

    world.addComponent(player1, "position", {
      x: 220,
      y: 240,
    });

    world.addComponent(player1, "velocity", {
      x: 10,
      y: 0,
    });

    world.addComponent(player1, "visual", {
      color: "red",
      size: 10
    });
  },

  //Regiter my main game callback
  gameLoopCallback: (delta)=>{
    broadcast(io, world, delta);
    physics(world, delta);
  }

}