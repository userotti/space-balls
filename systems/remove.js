module.exports = (world)=>{
  const entities =  world.find(['position']);
  for (entity of entities){
    if (Math.sqrt(Math.pow(entity.position.x, 2) + Math.pow(entity.position.y, 2)) > 1000){
      world.removeEntity(entity);
    }
  }
}