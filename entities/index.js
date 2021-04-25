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
      world.removeComponent(existingPlayer, "destroyed");
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
  
      world.addComponent(player, "player", true);
    }
    
    let placementRadius = 1500;
    let minimumDistanceToPlanetSurfice = 300;
    let minimumDistanceToPlayer = 200;
    let playerPosition = randomCircleLocaltion(placementRadius);
    console.log("playerPosition: ", playerPosition);

    while(toCloseToPositions(playerPosition, world.find(['planet']).map((planet)=>{
      console.log("planet: ", planet);
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

    const startCycles = 200;
    world.addComponent(bullet, "countdown", {
      start_cycles: startCycles,
      cycles: startCycles
    });


  },

  createPlanet: (world, planetName, components)=>{
    var planet = world.createEntity();

    for (componentName of Object.keys(components)){
      world.addComponent(planet, componentName, components[componentName]);
    }

    if (!components["position"]) {
      
      let placementRadius = 1000;
      let minimumDistanceToPlanetSurfice = 150;
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


  
}