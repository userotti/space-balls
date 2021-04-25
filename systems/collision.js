module.exports = (io, world, delta)=>{
  const bullets =  world.find(['bullet']);
  const planets =  world.find(['planet']);
  const players =  world.find(['player']);
  

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

  for (bullet of bullets){
    for (player of players){

      const positionDifference = {
        x: player.position.x - bullet.position.x,
        y: player.position.y - bullet.position.y
      }

      if (Math.abs(positionDifference.x*2) < player.visual.size+bullet.visual.size && Math.abs(positionDifference.y*2) < player.visual.size+bullet.visual.size){
        if (bullet.countdown.start_cycles - bullet.countdown.cycles > 5 ){

          world.addComponent(bullet, "destroyed", {
            fired_by_player_uuid: bullet.details.playerUuid,
            killed_player_uuid: player.uuid
          })

          world.removeEntity(bullet);
          console.log("bullet.details: ", bullet.details);

          console.log("bulletPlayerId: ", bullet.details.playerUuid);

          const bulletPlayer = world.findById(bullet.details.playerUuid)
          console.log("bulletPlayer: ", bulletPlayer);

          if (bulletPlayer){
            
            if (bulletPlayer.uuid != player.uuid){
              bulletPlayer.details.score = bulletPlayer.details.score + 1; 
            } else {
              player.details.score = player.details.score - 1;
            }

            io.emit('score_update', {
              scoreboard_items: world.find(['player']).sort((p1,p2)=>{
                return p2.details.score - p1.details.score
              }).map((player)=>{
                return `${player.details.name}: ${player.details.score}`;
              })
            });
            
          }
          
          io.emit('bullet_player_explosion', {
            position: bullet.position
          });
        }
      }
            
    }  
  }
  

}