const canvasWidth = 800;
const canvasHeight = 600;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var socket = io();

var user = {
  id: 0
}

var entities = [];
var messages = [];

socket.on('state', function(event) {
  entities = event.entities
});

socket.on('message', function(event) {
  messages.push({
    delay: 5000,
    text: event.message,
  }); 
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
  aiming.mousedown.x = event.offsetX
  aiming.mousedown.y = event.offsetY

  console.log("event: ", event);

  aiming.active = true;

});

document.getElementById("canvas").addEventListener("mouseup", function(event) {
  aiming.mouseup.x = event.offsetX
  aiming.mouseup.y = event.offsetY

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
  aiming.mousemove.x = event.offsetX;
  aiming.mousemove.y = event.offsetY;
});


setInterval(()=>{

  ctx.clearRect(0,0,canvasWidth,canvasHeight);

  for (entity of entities){
    ctx.fillStyle = entity.visual.color;

    if (entity.visual.shape == "square"){
      ctx.fillRect(entity.position.x-entity.visual.size/2, entity.position.y-entity.visual.size/2, entity.visual.size, entity.visual.size);
    }

    if (entity.visual.shape == "circle"){
      ctx.beginPath();
      ctx.arc(entity.position.x, entity.position.y, entity.visual.size, 0, 2 * Math.PI);
      ctx.fill();
    }
    

    ctx.font = "10px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(entity.details.name, entity.position.x, entity.position.y - 10);
  }
  
  //Remove message that are done with the delay.
  messages = messages.filter((message, index)=>{
    if (message.delay > 0) {
      message.delay = message.delay - 50;
      ctx.font = "10px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(message.text, 20, canvasHeight - (index * 15) - 20);
    } else {
      message.delay = 0
    }
    return !!message.delay
  })


  if (aiming.active){
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(aiming.mousedown.x, aiming.mousedown.y);
    ctx.lineTo(aiming.mousemove.x, aiming.mousemove.y);
    ctx.stroke();
  }

}, 50)