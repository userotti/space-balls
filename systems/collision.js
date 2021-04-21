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

          world.removeEntity(bullet);
          world.addComponent(player, "destroyed", {
            destroyed_by_socket_connection_id: bullet.details.player_socket_connection_id
          })

          world.removeEntity(player);

          const bulletPlayer = world.find(['player']).find((player)=>{
            return player.socketConnection.id == bullet.details.player_socket_connection_id
          })

          if (bulletPlayer){
            bulletPlayer.details.score = bulletPlayer.details.score + 1; 
          }
          
          io.emit('bullet_player_explosion', {
            position: bullet.position
          });
        }
      }
            
    }  
  }
  

}