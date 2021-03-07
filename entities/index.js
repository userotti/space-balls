module.exports = {
  createPlayer: (world)=>{
    var player = world.createEntity();
    world.addComponent(player, "position", {
      x: 220,
      y: 240,
    });

    world.addComponent(player, "velocity", {
      x: 10,
      y: 0,
    });

    world.addComponent(player, "visual", {
      shape: "square",
      color: "blue",
      size: 20
    });
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