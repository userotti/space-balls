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
  console.log("event.entities.length: ", event.entities.length);
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

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  socket.emit('fire', {
    userId: userId,
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
    ctx.fillRect(entity.position.x-entity.visual.size/2, entity.position.y-entity.visual.size/2, entity.visual.size, entity.visual.size);

    ctx.font = "10px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(entity.details.name, entity.position.x, entity.position.y - 10);
  }

  if (aiming.active){
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(aiming.mousedown.x, aiming.mousedown.y);
    ctx.lineTo(aiming.mousemove.x, aiming.mousemove.y);
    ctx.stroke();
  }
  


}, 100)