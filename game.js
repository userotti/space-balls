const World = require('index-ecs').World;
const broadcast = require('./systems/broadcast');
const physics = require('./systems/physics');
const remove = require('./systems/remove');
const entityCreator = require('./entities');



var world = new World();
var users = [];
var io;

module.exports = {

  gameInit: (_io)=>{
    
    io = _io;
    
    entityCreator.createPlayer(world);

    world.on("entity-removed", function(entity) {
      return console.log("Goodbye ID " + entity.uuid);
    });

    io.on('fire', (socket) => {
      entityCreator.createBullet(world, {
        "position": {
          x: 220,
          y: 240,
        },
        "velocity": {
          x: 0,
          y: 0,
        }
      });
    });
    
  },

  //Regiter my main game callback
  gameLoopCallback: (delta)=>{
    remove(world);
    broadcast(io, world, delta);
    physics(world, delta);
  },

  addUser: (user, id)=>{
    users.push({
      id: id,
      ...user
    })
  },

  fire: (message)=>{

    //Notify all immediately
    // io.emit('fire', message);

    const {user, vector} = message;

    entityCreator.createBullet(world, {
      "position": {
        x: 220,
        y: 240,
      },
      "velocity": {
        x: vector.x / 10,
        y: vector.y / 10,
      }
    });


  }

}