module.exports = (world, delta)=>{
  const bullets =  world.find(['bullet']);
  const players =  world.find(['player']);
  
  for (bullet of bullets){
    for (player of players){

      const positionDifference = {
        x: player.position.x - bullet.position.x,
        y: player.position.y - bullet.position.y
      }

      if (Math.abs(positionDifference.x*2) < player.visual.size+bullet.visual.size && Math.abs(positionDifference.y*2) < player.visual.size+bullet.visual.size){
        if (bullet.countdown.start_cycles - bullet.countdown.cycles > 10 ){

          world.addComponent(bullet, "destroyed", {
            fired_by_player_uuid: bullet.details.playerUuid,
            killed_player_uuid: player.uuid
          })

          world.removeEntity(bullet);
          
          const bulletPlayer = world.findById(bullet.details.playerUuid)
          
          if (bulletPlayer){
            
            if (bulletPlayer.uuid != player.uuid){
              bulletPlayer.details.score = bulletPlayer.details.score + 1; 
            } else {
              player.details.score = player.details.score - 1;
            }

            world.emit('score_update');
            
          }

          world.emit('player_bullet_collistion_event', player, bullet);
          
        }
      }
            
    }  
  }
  

}