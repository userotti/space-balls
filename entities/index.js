const randomCircleLocaltion = (radiusContainer)=>{
  let angle = (Math.PI*2) * Math.random();
  let radius = Math.random();
  radius = Math.sqrt(radius) * radiusContainer;
  return {
    x: radius * Math.cos(angle), 
    y: radius * Math.sin(angle), 
  }
}

const toCloseToPosition = (position, other_position, padding)=>{
  let distance = Math.sqrt(Math.pow(position.x - other_position.x, 2) + Math.pow(position.y - other_position.y, 2))
  return distance < padding
}

const toCloseToPositions = (position, other_positions, padding)=>{
  return other_positions.reduce((total, other)=>{
    return total || toCloseToPosition(position, other, padding);
  }, false)
}

module.exports = {
  createOrReplacePlayerAtCalculatedPosition: (world, username, existingPlayer)=>{
    
    var player;
    if (existingPlayer){
      world.removeComponent(existingPlayer, "position");
      world.removeComponent(existingPlayer, "velocity");
      player = existingPlayer;
    } else {
      player =  world.createEntity();
      world.addComponent(player, "visual", {
        shape: "square",
        color: "blue",
        size: 40
      });
  
      world.addComponent(player, "details", {
        name: username,
        score: 0,
      });

      world.addComponent(player, "cooldown", {
        value: 0,
        max: 100,
        rate: 1.2,
      });
  
      world.addComponent(player, "player", true);
    }
    
    let placementRadius = 2500;
    let minimumDistanceToPlanetSurfice = 700;
    let minimumDistanceToPlayer = 150;
    let playerPosition = randomCircleLocaltion(placementRadius);
    
    while(toCloseToPositions(playerPosition, world.find(['planet']).map((planet)=>{
      return planet.position
    }), minimumDistanceToPlanetSurfice) || toCloseToPositions(playerPosition, world.find(['player', 'position']).map((otherPlayer)=>{
      return otherPlayer.position
    }), minimumDistanceToPlayer)){
      playerPosition = randomCircleLocaltion(placementRadius);
    }
    
    world.addComponent(player, "position", playerPosition);

    world.addComponent(player, "velocity", {
      x: 0,
      y: 0,
    });

    

    return player;
  },

  createBullet: (world, components)=>{
    var bullet = world.createEntity();

    for (componentName of Object.keys(components)){
      world.addComponent(bullet, componentName, components[componentName]);
    }
  
    world.addComponent(bullet, "visual", {
      shape: "square",
      color: "red",
      size: 10
    });

    world.addComponent(bullet, "acceleration", {
      x: 0,
      y: 0,
    });

    world.addComponent(bullet, "charge", {
      value: -1 
    });

    world.addComponent(bullet, "bullet", true);

    world.addComponent(bullet, "countdown", {
      start_cycles: 400,
      cycles: 400
    });


  },

  createPlanet: (world, planetName, components)=>{
    var planet = world.createEntity();

    for (componentName of Object.keys(components)){
      world.addComponent(planet, componentName, components[componentName]);
    }

    if (!components["position"]) {
      
      let placementRadius = 2000;
      let minimumDistanceToPlanetSurfice = 500;
      let planetPosition = randomCircleLocaltion(placementRadius);
      
      while(toCloseToPositions(planetPosition, world.find(['planet']).map((planet)=>{
        return planet.position
      }), minimumDistanceToPlanetSurfice)){
        planetPosition = randomCircleLocaltion(placementRadius);
      }
      
      world.addComponent(planet, "position", planetPosition);
    }

    if (!components["visual"]) {
      world.addComponent(planet, "visual", {
        shape: "circle",
        color: "green",
        size: Math.random()*20 + 50
      });
    }

    if (!components["charge"]) {
      world.addComponent(planet, "charge", {
        value: 100
      });
    }

    world.addComponent(planet, "planet", true);

    world.addComponent(planet, "details", {
      name: planetName,
    });
  },

  createExplosion: (world, position, power, blastOriginatorPlayerUuid)=>{
    var explosion = world.createEntity();

    world.addComponent(explosion,"details", {
      blastOriginatorPlayerUuid: blastOriginatorPlayerUuid,
    })

    world.addComponent(explosion,"position", {
      x: position.x,
      y: position.y
    })

    world.addComponent(explosion, "countdown", {
      start_cycles: -10,
      cycles: 30
    });

    world.addComponent(explosion, "shockwave", {
      radius: 0,
      max_radius: power*5,
      speed: 10
    });

    world.addComponent(explosion, "blast", {
      radius: 0,
      max_radius: power,
      speed: 2,
    });

    
  },


  
}