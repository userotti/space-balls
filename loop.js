const hrtimeMs = function() {
  let time = process.hrtime()
  return time[0] * 1000 + time[1] / 1000000
}

const TICK_RATE = 50
let tick = 0
let previous = hrtimeMs()
let tickLengthMs = 1000 / TICK_RATE

var logicCallback;

const loop = () => {
  setTimeout(loop, tickLengthMs)
  let now = hrtimeMs()
  let delta = (now - previous) / 1000
  logicCallback(delta);
  previous = now
  tick++
}



module.exports = kickoff = (callback)=>{
  logicCallback = callback
  return loop
}