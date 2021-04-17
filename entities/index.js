module.exports = {
  createPlayer: (world, username)=>{
    var player = world.createEntity();
    world.addComponent(player, "position", {
      x: Math.random()*100-Math.random()*100 + 220,
      y: Math.random()*100-Math.random()*100 + 240,
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
      size: 5
    });

  },


  
}