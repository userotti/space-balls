const canvasWidth = 600;
const canvasHeight = 600;

const queryParams = new URLSearchParams(window.location.search);
const currentPlayerUuid = queryParams.get("userId");
if (currentPlayerUuid){
  document.getElementById("join_button").style="display: none;";
  document.getElementById("spectate_button").style="display: flex;";
  
  const chatInputElement = document.getElementById("chat_input");
  chatInputElement.addEventListener('keydown', (event)=>{
    
    if (currentPlayerUuid && event.key == "Enter") {
      socket.emit('chat', {
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

var lockOnPlayerId = true;
var followLastBullet = false;

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

socket.on('score_update', function(event) {
  const scoreBox = document.getElementById("scoreboard");
  while (scoreBox.firstChild) {
    scoreBox.removeChild(scoreBox.firstChild);
  }
  for (const [index,value] of event.scoreboard_items.entries()){
    scoreTag = document.createElement('span');
    scoreTag.innerText  = `${index+1}. ${value}`;
    scoreTag.style = `font-size: 12px; color: #999`;
    scoreBox.appendChild(scoreTag);
  }
})

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
  angle: {
    value: 0
  },
  power: {
    value: 0
  },
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

  shot.power = Math.sqrt(Math.pow(aiming.mousedown.y - aiming.mouseup.y, 2) + Math.pow(aiming.mousedown.x - aiming.mouseup.x, 2)) * 0.05
  
  shot.angle = Math.atan2((aiming.mousedown.y - aiming.mouseup.y), -1 * (aiming.mousedown.x - aiming.mouseup.x));
  shot.angle = ((shot.angle + Math.PI) * 180) / Math.PI

  let powerInput = document.getElementById("power_input");
  let angleInput = document.getElementById("angle_input");
  
  powerInput.value = shot.power
  angleInput.value = shot.angle

});

document.getElementById("power_input").addEventListener("input", function(event) {
  console.log("power_input");
});

document.getElementById("angle_input").addEventListener("input", function(event) {
  console.log("angle_input");
});


document.getElementById("fire_button").addEventListener("click", function(event) {
  

  let powerInput = document.getElementById("power_input");
  
  if (!!Number(powerInput.value)){
    shot.power = powerInput.value;

    shot.power = Math.min(Math.max(shot.power, 5), 30);

  } else {
    shot.power = 5;
  }
  
  powerInput.value = shot.power;

  let angleInput = document.getElementById("angle_input");
  
  if (!!Number(angleInput.value)){
    shot.angle = angleInput.value;
  } else {
    shot.angle = 0;
  }
  
  angleInput.value = shot.angle;

  
  console.log("fire: ",  {
    angle: shot.angle,
    power: shot.power,
  });

  socket.emit('fire', {
    angle: shot.angle,
    power: shot.power,
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
  pan.y += 150;
  lockOnPlayerId = false;
  followLastBullet = false;
  document.getElementById("follow_bullet").style = ""
});

document.getElementById("pan_down").addEventListener("click", function(event) {
  pan.y -= 150;
  lockOnPlayerId = false;
  followLastBullet = false;
  document.getElementById("follow_bullet").style = ""
});

document.getElementById("pan_left").addEventListener("click", function(event) {
  pan.x += 150;
  lockOnPlayerId = false;
  followLastBullet = false;
  document.getElementById("follow_bullet").style = ""
});

document.getElementById("pan_right").addEventListener("click", function(event) {
  pan.x -= 150;
  lockOnPlayerId = false;
  followLastBullet = false;
  document.getElementById("follow_bullet").style = ""
});

document.getElementById("home").addEventListener("click", function(event) {
  lockOnPlayerId = true;
  followLastBullet = false;
  document.getElementById("follow_bullet").style = ""
});

document.getElementById("follow_bullet").addEventListener("click", function(event) {
  followLastBullet = true;
  lockOnPlayerId = false;
  document.getElementById("follow_bullet").style = "color: white;"
});


setInterval(()=>{

  ctx.clearRect(0,0,canvasWidth,canvasHeight);

  const currentPlayer = entities.find((entity)=>{
    return currentPlayerUuid == entity.uuid
  });

  if (lockOnPlayerId){
    

    if (currentPlayer){
      pan = {
        x: currentPlayer.position.x * -1 +(canvasWidth/2),
        y: currentPlayer.position.y * -1 +(canvasHeight/2),
      }
    }
  }

  if (followLastBullet){
    const bullets = entities.filter((entity)=>{
      return (entity.details && currentPlayer && currentPlayer.socketConnection && entity.details.playerUuid == currentPlayerUuid);
    }).sort((b1, b2)=>{
      return b1.countdown.cycles - b2.countdown.cycles 
    });

    if (bullets && bullets[bullets.length-1]){
      pan = {
        x: bullets[bullets.length-1].position.x * -1 +(canvasWidth/2),
        y: bullets[bullets.length-1].position.y * -1 +(canvasHeight/2),
      }
    }
  }
  

  for (entity of entities){

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(canvasWidth/2, canvasHeight/2);
    ctx.scale(zoom.x, zoom.y);
    ctx.translate(-(canvasWidth/2), -(canvasHeight/2));
    ctx.translate(pan.x, pan.y);
    ctx.translate(entity.position.x, entity.position.y);

    if (entity.visual) {
      ctx.fillStyle = entity.visual.color;

      if (entity.visual.shape == "square"){
        ctx.fillRect(0-entity.visual.size/2, 0-entity.visual.size/2, entity.visual.size, entity.visual.size);
      }

      if (entity.cooldown){
        ctx.beginPath();
        ctx.arc(0,0,50,0,(2*Math.PI) * (entity.cooldown.value / entity.cooldown.max));
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'green';
        ctx.stroke();
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

    if (entity.shockwave){
      ctx.strokeStyle = "#fff";

      ctx.beginPath();
      ctx.arc(0, 0, entity.shockwave.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    if (entity.blast){
      ctx.fillStyle = "#ff0";

      ctx.beginPath();
      ctx.arc(0, 0, entity.blast.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
  }


  ctx.setTransform(1, 0, 0, 1, 0, 0);
  

  if (aiming.active){
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(aiming.mousedown.x, aiming.mousedown.y);
    ctx.lineTo(aiming.mousemove.x, aiming.mousemove.y);
    ctx.stroke();
  }

}, 50)