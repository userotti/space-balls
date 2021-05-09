module.exports = (world, delta)=>{
  const entities =  world.find(['cooldown']);
  
  for (entity of entities){
    if (entity.cooldown.value < entity.cooldown.max){
      entity.cooldown.value = entity.cooldown.value + entity.cooldown.rate
    } else {
      entity.cooldown.value = entity.cooldown.max
    }
  }
  
}