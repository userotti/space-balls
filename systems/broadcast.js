module.exports = (io, world, delta)=>{
  const entities =  world.find(['position']);
  io.emit('positions', { entities: entities });
}