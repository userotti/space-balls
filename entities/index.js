module.exports = {
  createPlayer: (world, username)=>{
    var player = world.createEntity();
    world.addComponent(player, "position", {
      x: Math.random()*1000-Math.random()*1000 + 220,
      y: Math.random()*1000-Math.random()*1000 + 240,
    });

    world.addComponent(player, "velocity", {
      x: 0,
      y: 0,
    });

    world.addComponent(player, "visual", {
      shape: "square",
      color: "blue",
      size: 20
    });

    world.addComponent(player, "details", {
      name: username,
      score: 0,
    });

    world.addComponent(player, "player", true);

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
      size: 5
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
      world.addComponent(planet, "position", {
        x: Math.random()*100-Math.random()*100 + 400,
        y: Math.random()*100-Math.random()*100 + 300,
      });
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