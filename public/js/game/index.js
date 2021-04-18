const canvasWidth = 800;
const canvasHeight = 600;

const queryParams = new URLSearchParams(window.location.search);
const currentUserId = queryParams.get("userId");
if (currentUserId){
  document.getElementById("join_button").style="display: none;";
  document.getElementById("spectate_button").style="display: flex;";

  
  
  const chatInputElement = document.getElementById("chat_input");
  chatInputElement.addEventListener('keydown', (event)=>{
    
    if (currentUserId && event.key == "Enter") {
      console.log("gooi chat", chatInputElement.value);
      socket.emit('chat', {
        userId: currentUserId,
        message: chatInputElement.value,
      });

      chatInputElement.value = '';
    }
    
  })
  
} else {
  document.getElementById("join_button").style="";
  document.getElementById("spectate_button").style="display: none;";
  document.getElementById("chat_widget").style="display: none;";
}




var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var socket = io();

var user = {
  id: 0
}

var zoom = {
  x: 1,
  y: 1,
}

var pan = {
  x: 0,
  y: 0
}

var entities = [];
var messages = [];

socket.on('state', function(event) {
  entities = event.entities
});

socket.on('message', function(event) {
  const messageBox = document.getElementById("message_box");

  messageTag = document.createElement('span');
  messageTag.innerText  = `-${event.message}`;
  messageTag.style = `font-size: 12px;"`;
  
  messageBox.insertBefore(messageTag, messageBox.childNodes[0]);
  
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

document.getElementById("zoom_in").addEventListener("click", function(event) {
  console.log("zoom_in");
  zoom.x *= 1.2;
  zoom.y *= 1.2;
});

document.getElementById("zoom_out").addEventListener("click", function(event) {
  zoom.x *= 0.8;
  zoom.y *= 0.8;
});

document.getElementById("pan_up").addEventListener("click", function(event) {
  pan.y += 50;
  console.log("up")
});

document.getElementById("pan_down").addEventListener("click", function(event) {
  pan.y -= 50;
});

document.getElementById("pan_left").addEventListener("click", function(event) {
  pan.x += 50;
});

document.getElementById("pan_right").addEventListener("click", function(event) {
  pan.x -= 50;
});


setInterval(()=>{

  ctx.clearRect(0,0,canvasWidth,canvasHeight);

  
  

  for (entity of entities){
    ctx.fillStyle = entity.visual.color;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(canvasWidth/2, canvasHeight/2);
    ctx.scale(zoom.x, zoom.y);
    ctx.translate(-(canvasWidth/2), -(canvasHeight/2));
    ctx.translate(pan.x, pan.y);
    ctx.translate(entity.position.x, entity.position.y);
    
      

    if (entity.visual.shape == "square"){
      ctx.fillRect(0-entity.visual.size/2, 0-entity.visual.size/2, entity.visual.size, entity.visual.size);
    }

    if (entity.visual.shape == "circle"){
      ctx.beginPath();
      ctx.arc(0, 0, entity.visual.size, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.scale(1/zoom.x, 1/zoom.y);

    ctx.fillStyle = entity.visual.color;
    ctx.font = "10px Arial";
    ctx.fillStyle = "white";

    if (entity.countdown){
      ctx.fillText(`${entity.details.name} ${entity.countdown.cycles}`, 0, 0 - 10);
    } else {
      ctx.fillText(entity.details.name, 0, 0 - 10);
    }
    
    
  }


  ctx.setTransform(1, 0, 0, 1, 0, 0);
  
  //Remove message that are done with the delay.
  // messages = messages.filter((message, index)=>{
  //   if (message.delay > 0) {
  //     message.delay = message.delay - 50;
  //     ctx.font = "10px Arial";
  //     ctx.fillStyle = "white";
  //     ctx.fillText(message.text, 20, canvasHeight - (index * 15) - 20);
  //   } else {
  //     message.delay = 0
  //   }
  //   return !!message.delay
  // })


  if (aiming.active){
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(aiming.mousedown.x, aiming.mousedown.y);
    ctx.lineTo(aiming.mousemove.x, aiming.mousemove.y);
    ctx.stroke();
  }

}, 50)