const World = require('index-ecs').World;
const broadcast = require('./systems/broadcast');
const physics = require('./systems/physics');
const remove = require('./systems/remove');
const collision = require('./systems/collision');

const entityCreator = require('./entities');



var world = new World();
var users = [];
var io;



const game = {

  gameInit: (_io)=>{
    
    io = _io;

    

    world.on("entity-removed", function(entity) {
      if (entity.destroyed){
        const newPlayerEntity = entityCreator.createPlayerAtCalculatedPosition(world, entity.details.name);
        game.linkUserIdWithConnectionId(newPlayerEntity.uuid, entity.socketConnection.id);
      }
    });

    
    entityCreator.createPlanet(world, 'Dawn', {
      charge: {
        value: 120,
      }
    })
    entityCreator.createPlanet(world, 'V-NEXT', {
      visual: {
        shape: "circle",
        color: "green",
        size: Math.random()*20 + 50
      },
      charge: {
        value: 80,
      }
    })

    entityCreator.createPlanet(world, 'Stack Deploy', {
      visual: {
        shape: "circle",
        color: "green",
        size: Math.random()*20 + 40
      },
      charge: {
        value: 80,
      }
    })

    
  },

  getPlayerByConnectionId: (connectionId) => {
    return world.find(['player']).find((player)=>{
      if (player.socketConnection){
        return player.socketConnection.id == connectionId
      } else {
        return false;
      }
      
    })
  },

  linkUserIdWithConnectionId: (userId, connectionId) => {
    var player = world.findById(userId);


    world.addComponent(player, "socketConnection", {
      id: connectionId
    });

  },

  userIdCheck: (userId)=>{
    return !!world.findById(userId);
  },

  gameLoopCallback: (delta)=>{
    remove(world);
    broadcast(io, world, delta);
    physics(world, delta);
    collision(io, world, delta);
  },

  addUser: (username)=>{
    const playerEntity = entityCreator.createPlayerAtCalculatedPosition(world, username);
    io.emit('message', {
      message: `${playerEntity.details.name} joined the solar system.`,
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

  chat: (data)=>{
    const {connectionId, message} = data;
    const userChatting = game.getPlayerByConnectionId(connectionId);
    if (userChatting){
      io.emit('message', {
        message: `${userChatting.details.name}: ${message}`
      })  
    }
  },

  fire: (data)=>{
    const {connectionId, vector} = data;
    const userFiringBullet = game.getPlayerByConnectionId(connectionId);
  
    if (userFiringBullet){

      io.emit('message', {
        message: `shot FIRED by ${userFiringBullet.details.name}!`
      })

      entityCreator.createBullet(world, {
        "details": {
          player_socket_connection_id: userFiringBullet.socketConnection.id,
          name: `${userFiringBullet.details.name}'s bullet`,
        },
        "position": {
          x: userFiringBullet.position.x,
          y: userFiringBullet.position.y,
        },
        "velocity": {
          x: vector.x / 10,
          y: vector.y / 10,
        }
      });
    }
  }

}

module.exports = game;