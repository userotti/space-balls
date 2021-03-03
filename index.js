var World = require('index-ecs').World;


const hrtimeMs = function() {
  let time = process.hrtime()
  return time[0] * 1000 + time[1] / 1000000
}

const TICK_RATE = 200
let tick = 0
let previous = hrtimeMs()
let tickLengthMs = 1000 / TICK_RATE

const loop = () => {
  setTimeout(loop, tickLengthMs)
  let now = hrtimeMs()
  let delta = (now - previous) / 1000
  console.log('delta', delta)
  // game.update(delta, tick) // game logic would go here
  previous = now
  tick++
}

loop() // starts the loop