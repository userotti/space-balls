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

    entityCreator.createPlanet(world, 'Andromedon')
    
  },

  isLinkedToActivePlayer: (connectionId) => {
    return world.find(['player']).find((player)=>{
      return player.socketConnection.id == connectionId
    })
  },

  linkUserIdWithConnectionId: (userId, connectionId) => {
    var player = world.findById(userId);


    world.addComponent(player, "socketConnection", {
      id: connectionId
    });

    console.log("player: ", player);

  },

  userIdCheck: (userId)=>{
    return !!world.findById(userId);
  },

  gameLoopCallback: (delta)=>{
    remove(world);
    broadcast(io, world, delta);
    physics(world, delta);
  },

  addUser: (username)=>{
    const playerEntity = entityCreator.createPlayer(world, username);
    io.emit('message', {
      message: `${playerEntity.details.name} joined the solar system.`
    })
    return playerEntity;
  },

  removeUserWithConnectionId: (connectionId)=>{
    
    for (player of world.find(['player'])) {
      if (player.socketConnection && connectionId && player.socketConnection.id == connectionId){
        world.removeEntity(player);
        
        io.emit('message', {
          message: `${player.details.name} disconnected.`
        })

      }
    }

    
  },

  fire: (message)=>{
    const {userId, vector} = message;
    const userFiringBullet = world.findById(userId);
    if (userFiringBullet){

      io.emit('message', {
        message: `shot fired by ${userFiringBullet.details.name}!`
      })

      entityCreator.createBullet(world, {
        "details": {
          name: `${userFiringBullet.details.name}'s bullet`,
        },
        "position": {
          x: userFiringBullet.position.x,
          y: userFiringBullet.position.y,
        },
        "velocity": {
          x: vector.x / 20,
          y: vector.y / 20,
        }
      });
    }
  }

}