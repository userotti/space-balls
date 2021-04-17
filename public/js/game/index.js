console.log("here we go");
const canvasWidth = 640;
const canvasHeight = 480;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var socket = io();

var user = {
  id: 0
}

var entities = [];
socket.on('state', function(event) {
  // console.log("event.entities: ", event.entities);
  entities = event.entities
});

const aiming = {
  mousemove: {
    x: 0,
    y: 0
  },
  mousedown: {
    x: 0,
    y: 0
  },
  mouseup: {
    x: 0,
    y: 0
  },
  active: false
}

const shot = {
  vector: {
    x: 0,
    y: 0
  },
}
//Setup interaction
document.getElementById("canvas").addEventListener("mousedown", function(event) {
  aiming.mousedown.x = event.clientX
  aiming.mousedown.y = event.clientY

  aiming.active = true;

});

document.getElementById("canvas").addEventListener("mouseup", function(event) {
  aiming.mouseup.x = event.clientX
  aiming.mouseup.y = event.clientY

  aiming.active = false;

  console.log(socket);
  socket.emit('fire', {
    user: user.id,
    vector: {
      x: aiming.mousedown.x - aiming.mouseup.x,
      y: aiming.mousedown.y - aiming.mouseup.y,
    }
  });
});

document.getElementById("canvas").addEventListener("mousemove", function(event) {
  aiming.mousemove.x = event.clientX;
  aiming.mousemove.y = event.clientY;
});


setInterval(()=>{
  ctx.clearRect(0,0,canvasWidth,canvasHeight);

  for (entity of entities){
    ctx.fillStyle = entity.visual.color;
    ctx.fillRect(entity.position.x, entity.position.y, entity.visual.size, entity.visual.size);
  }

  if (aiming.active){
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(aiming.mousedown.x, aiming.mousedown.y);
    ctx.lineTo(aiming.mousemove.x, aiming.mousemove.y);
    ctx.stroke();
  }
  


}, 100)