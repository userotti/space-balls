module.exports = (world, delta)=>{
  const blasters =  world.find(['blast']);
  const players =  world.find(['player']);
  
  for (blaster of blasters){
    for (player of players){

      const positionDifference = {
        x: player.position.x - blaster.position.x,
        y: player.position.y - blaster.position.y
      }
      

      if (Math.sqrt(Math.pow(positionDifference.x, 2) + Math.pow(positionDifference.y, 2)) < blaster.blast.radius){
        console.log("collision!");
        console.log("blaster.details.blastOriginatorPlayerUuid: ", blaster.details.blastOriginatorPlayerUuid);
        
        

        const blastPlayer = world.findById(blaster.details.blastOriginatorPlayerUuid)
        console.log("blastPlayer: ", blastPlayer);
        if (blastPlayer){
          
          console.log("blastPlayer: ", blastPlayer);
          if (blastPlayer.uuid != player.uuid){
            blastPlayer.details.score = blastPlayer.details.score + 1;
          } else {
            blastPlayer.details.score = blastPlayer.details.score - 1;
          }

          world.emit('score_update');
          
        }

        world.emit('player_blaster_collistion_event', player, blaster);
        
        
      }
            
    }  
  }
  

}