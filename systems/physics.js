module.exports = (world, delta)=>{
  const entities =  world.find(['position', 'velocity']);
  for (entity of entities){
    entity.position.x += entity.velocity.x
    entity.position.y += entity.velocity.y
  }
}