module.exports = (io, world, delta)=>{
  const bullets =  world.find(['bullet']);
  const planets =  world.find(['planet']);

  for (bullet of bullets){
    for (planet of planets){

      const positionDifference = {
        x: planet.position.x - bullet.position.x,
        y: planet.position.y - bullet.position.y
      }

      const dist = Math.sqrt(Math.pow(positionDifference.x,2) + Math.pow(positionDifference.y,2));

      if (dist < planet.visual.size + bullet.visual.size) {
        world.removeEntity(bullet);
        io.emit('bullet_planet_explosion', {
          position: bullet.position
        });
      }
      
    }  
  }


}