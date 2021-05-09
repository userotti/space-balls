const World = require('index-ecs').World;
const broadcast = require('./systems/broadcast');
const physics = require('./systems/physics');
const remove = require('./systems/remove');
const bullet_planet_collision = require('./systems/bullet_planet_collision');
const player_bullet_collision = require('./systems/player_bullet_collision');

const player_blaster_collision = require('./systems/player_blaster_collision');
const blast = require('./systems/blast');
const shockwave = require('./systems/shockwave');
const cooldown = require('./systems/cooldown');


const entityCreator = require('./entities');



var world = new World();
var users = [];
var io;



const game = {

  gameInit: (_io)=>{
    
    io = _io;

    

    world.on("entity-removed", function(entity) {
      
    });

    world.on("player_bullet_collistion_event", function(killedPlayer, bullet){
      entityCreator.createExplosion(world, killedPlayer.position, 250, bullet.destroyed.fired_by_player_uuid);
      entityCreator.createOrReplacePlayerAtCalculatedPosition(world, killedPlayer.details.name, killedPlayer);
    });

    world.on("player_blaster_collistion_event", function(killedPlayer, blaster){
      entityCreator.createExplosion(world, killedPlayer.position, 250, blaster.details.blastOriginatorPlayerUuid);
      entityCreator.createOrReplacePlayerAtCalculatedPosition(world, killedPlayer.details.name, killedPlayer);
    });

    world.on("score_update", function(){
      game.sendScoreUpdate();
    })
    
    entityCreator.createPlanet(world, 'Dawn', {
      visual: {
        shape: "circle",
        color: "green",
        size: 150
      },
      charge: {
        value: 120,
      }
    })

    entityCreator.createPlanet(world, 'v-next', {
      visual: {
        shape: "circle",
        color: "green",
        size: 90
      },
      charge: {
        value: 80,
      }
    })
    entityCreator.createPlanet(world, 'Indie Galaxy', {
      visual: {
        shape: "circle",
        color: "green",
        size: 170
      },
      charge: {
        value: 80,
      }
    })

    entityCreator.createPlanet(world, 'Stack Deploy', {
      visual: {
        shape: "circle",
        color: "green",
        size: 80
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
    player_bullet_collision(world, delta);
    bullet_planet_collision(io, world, delta);
    blast(world, delta);
    shockwave(world, delta);
    player_blaster_collision(world, delta);
    cooldown(world, delta);
    
    
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
    let {connectionId, power, angle} = data;

    power = Math.min(Math.max(power, 5), 30);
    angle = Math.min(Math.max(angle, 0), 360);

    velocity = {
      x: Math.cos((angle / 180) * Math.PI) * power,
      y: Math.sin((angle / 180) * Math.PI) * -power,
    }

    const userFiringBullet = game.getPlayerByConnectionId(connectionId);

    if (userFiringBullet){
      
      
      //Cooldown check
      if (userFiringBullet.cooldown.value == userFiringBullet.cooldown.max){
        
        io.emit('message', {
          message: `shot fired by ${userFiringBullet.details.name}!`
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
            x: velocity.x,
            y: velocity.y,
          }
        });
      }

      //Reset cooldown anyway
      userFiringBullet.cooldown.value = 0;
      
      
    }
  }

}

module.exports = game;