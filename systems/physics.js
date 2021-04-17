module.exports = (world, delta)=>{
  const bullets =  world.find(['charge', 'acceleration', 'bullet']);
  const planets =  world.find(['charge', 'planet']);

  for (bullet of bullets){
    for (planet of planets){

      const positionDifference = {
        x: planet.position.x - bullet.position.x,
        y: planet.position.y - bullet.position.y
      }
      const dist = Math.sqrt(Math.pow(positionDifference.x,2) + Math.pow(positionDifference.y,2));

      const force = (planet.charge.value * bullet.charge.value) / dist

      const dieHoek = Math.atan2(positionDifference.y, positionDifference.x);
      bullet.acceleration.x = Math.cos(dieHoek + Math.PI) * force;
      bullet.acceleration.y = Math.sin(dieHoek + Math.PI) * force;
      
      bullet.velocity.x += bullet.acceleration.x
      bullet.velocity.y += bullet.acceleration.y
      
    }  
  }
  
  
  
  const entities =  world.find(['position', 'velocity']);
  for (entity of entities){
    entity.position.x += entity.velocity.x
    entity.position.y += entity.velocity.y
  }

  


}