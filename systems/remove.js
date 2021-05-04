module.exports = (world)=>{
  let planets =  world.find(['position', 'planets']);
  let players =  world.find(['position', 'player']);
  
  

  let bullets =  world.find(['position', 'bullet']);
  for (entity of bullets){
    if (Math.sqrt(Math.pow(entity.position.x, 2) + Math.pow(entity.position.y, 2)) > 4000){
      world.removeEntity(entity);
    }

    if  (entity.countdown.cycles <= 0){
      world.removeEntity(entity);
    } else {
      entity.countdown.cycles -= 1;
    }

  }

  let explosion = world.find(['blast', 'shockwave']);

  for (explosion of explosion){
    if (explosion.blast.radius >= explosion.blast.max_radius){
      if (explosion.shockwave.radius >= explosion.shockwave.max_radius){
        world.removeEntity(explosion);
      }
    }
  }

}