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
      if (entity.bullet && entity.destroyed){
        const killedPlayer = world.findById(entity.destroyed.killed_player_uuid);
        entityCreator.createOrReplacePlayerAtCalculatedPosition(world, killedPlayer.details.name, killedPlayer);
      }
    });

    
    entityCreator.createPlanet(world, 'Dawn', {
      visual: {
        shape: "circle",
        color: "green",
        size: Math.random()*20 + 100
      },
      charge: {
        value: 120,
      }
    })
    entityCreator.createPlanet(world, 'V-NEXT', {
      visual: {
        shape: "circle",
        color: "green",
        size: Math.random()*20 + 70
      },
      charge: {
        value: 80,
      }
    })

    entityCreator.createPlanet(world, 'Stack Deploy', {
      visual: {
        shape: "circle",
        color: "green",
        size: Math.random()*20 + 80
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
    const playerEntity = entityCreator.createOrReplacePlayerAtCalculatedPosition(world, username);
    io.emit('message', {
      message: `${playerEntity.details.name} joined the solar system.`,
    })
    return playerEntity;
  },

  sendScoreUpdate: ()=>{
    io.emit('score_update', {
      scoreboard_items: world.find(['player']).sort((p1,p2)=>{
        return p2.details.score - p1.details.score
      }).map((player)=>{
        return `${player.details.name}: ${player.details.score}`;
      })
    });
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
          playerUuid: userFiringBullet.uuid,
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