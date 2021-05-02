module.exports = (world, delta)=>{
  const entities =  world.find(['shockwave']);
  
  for (entity of entities){
    if (entity.shockwave.radius < entity.shockwave.max_radius){
      entity.shockwave.radius = entity.shockwave.radius + entity.shockwave.speed;
    }
  }
  
}