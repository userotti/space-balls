module.exports = (io, world, delta)=>{
  const entities =  world.find(['position']);
  io.emit('state', { entities: entities });
}