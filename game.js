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
      console.log("Goodbye ID " + entity.uuid);
      
      
      if (entity.destroyed){
        const newPlayerEntity = entityCreator.createPlayer(world, entity.details.name);
        newPlayerEntity.uuid = entity.uuid;
        game.linkUserIdWithConnectionId(newPlayerEntity.uuid, entity.socketConnection.connectionId);
      }


    });

    entityCreator.createPlanet(world, 'Dawn', {
      position: {
        x: 200,
        y: 200
      },
      
      charge: {
        value: 100,
      }
    })
    entityCreator.createPlanet(world, 'Tangent', {
      position: {
        x: 500,
        y: 200
      },
      visual: {
        shape: "circle",
        color: "red",
        size: Math.random()*20 + 20
      },
      charge: {
        value: -70,
      }
    })
    
  },

  getPlayerByConnectionId: (connectionId) => {
    return world.find(['player']).find((player)=>{
      return player.socketConnection.id == connectionId
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
    const playerEntity = entityCreator.createPlayer(world, username);
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
    const {userId, message} = data;
    const userChatting = world.findById(userId);
    if (userChatting){
      io.emit('message', {
        message: `${userChatting.details.name}: ${message}`
      })  
    }
  },

  fire: (message)=>{
    const {userId, vector} = message;
    const userFiringBullet = world.findById(userId);
    if (userFiringBullet){

      io.emit('message', {
        message: `shot FIRED by ${userFiringBullet.details.name}!`
      })

      entityCreator.createBullet(world, {
        "details": {
          player_uuid: userFiringBullet.uuid,
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

module.exports = game;