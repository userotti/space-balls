module.exports = (world, delta)=>{
  const entities =  world.find(['blast']);
  
  for (entity of entities){
    if (entity.blast.radius < entity.blast.max_radius){
      entity.blast.radius = entity.blast.radius + entity.blast.speed;
    }
  }
  
}