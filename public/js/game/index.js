const canvasWidth = 600;
const canvasHeight = 600;

const queryParams = new URLSearchParams(window.location.search);
const currentPlayerUuid = queryParams.get("userId");
if (currentPlayerUuid){
  document.getElementById("join_button").style="display: none;";
  // document.getElementById("spectate_button").style="display: flex;";
  
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


function getPointAtRadius(angleDegrees, radius){
  return {
    x: radius*Math.cos(-Math.PI * (angleDegrees/180)),
    y: radius*Math.sin(-Math.PI * (angleDegrees/180))
  };
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
  const messageBox = document.getElementById("message-box-log");
  messageTag = document.createElement('span');
  messageTag.innerText  = `${event.message}`;
  messageBox.append(messageTag);
  
});
socket.on('action', function(event) {
  const actionBox = document.getElementById("action-box-log");
  actionTag = document.createElement('span');
  actionTag.innerText  = `${event.message}`;
  actionBox.append(actionTag);
  
});

socket.on('score_update', function(event) {
  const scoreBox = document.getElementById("scoreboard-log");
  while (scoreBox.firstChild) {
    scoreBox.removeChild(scoreBox.firstChild);
  }
  for (const [index,value] of event.scoreboard_items.entries()){
    scoreTag = document.createElement('span');
    scoreTag.innerText  = `${index+1}. ${value}`;
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
  maxPower: 30,
  minPower: 5,
  angle: 45,
  power: 5,
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
  let powerInput = document.getElementById("power_input");
  if (!!Number(powerInput.value) || Number(powerInput.value) == 0){
    shot.power = powerInput.value;
    shot.power = Math.min(Math.max(shot.power, shot.minPower), shot.maxPower);
  }
});

document.getElementById("angle_input").addEventListener("input", function(event) {
  let angleInput = document.getElementById("angle_input");
  if (!!Number(angleInput.value) || Number(angleInput.value) == 0){
    shot.angle = angleInput.value;
  }
});


document.getElementById("fire_button").addEventListener("click", function(event) {
  

  let powerInput = document.getElementById("power_input");
  
  if (!!Number(powerInput.value)){
    shot.power = powerInput.value;

    shot.power = Math.min(Math.max(shot.power, shot.minPower), shot.maxPower);

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
  zoom.x *= 1.4;
  zoom.y *= 1.4;
});

document.getElementById("zoom_out").addEventListener("click", function(event) {
  zoom.x *= 0.6;
  zoom.y *= 0.6;
});

document.getElementById("pan_up").addEventListener("click", function(event) {
  pan.y += 250;
  lockOnPlayerId = false;
  followLastBullet = false;
  document.getElementById("follow_bullet").style = ""
});

document.getElementById("pan_down").addEventListener("click", function(event) {
  pan.y -= 250;
  lockOnPlayerId = false;
  followLastBullet = false;
  document.getElementById("follow_bullet").style = ""
});

document.getElementById("pan_left").addEventListener("click", function(event) {
  pan.x += 250;
  lockOnPlayerId = false;
  followLastBullet = false;
  document.getElementById("follow_bullet").style = ""
});

document.getElementById("pan_right").addEventListener("click", function(event) {
  pan.x -= 250;
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
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'green';
        ctx.stroke();
      }

      if (entity.visual.shape == "circle"){
        ctx.beginPath();
        ctx.arc(0, 0, entity.visual.size, 0, 2 * Math.PI);
        ctx.fill();
      }

      //UI follows
      ctx.scale(1/zoom.x, 1/zoom.y);

      ctx.fillStyle = entity.visual.color;
      // ctx.font = "10px Arial";
      ctx.font = "10px 'Passero One'";
      ctx.fillStyle = "white";

      if (entity.countdown){
        ctx.fillText(`${entity.details.name} ${entity.countdown.cycles}`, 0, 0 - 10);
      } else {
        ctx.fillText(entity.details.name, 0, 0 - 10);
      }
    }  
    //Player only UI
    if (shot && currentPlayerUuid && entity.player && entity.uuid == currentPlayerUuid){
      var aimRadius = 150;

      ctx.beginPath();
      
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#555';
      ctx.fillStyle = '#555';
      ctx.arc(0,0,aimRadius,0,(2*Math.PI));
      

      // let inputAngle = Number(document.getElementById("angle_input").value);
      
      // console.log("inputAngle: ", inputAngle);

      var aimRadiusPoint = {
        x: aimRadius*Math.cos(-Math.PI * (shot.angle/180)),
        y: aimRadius*Math.sin(-Math.PI * (shot.angle/180))
      };

      var aimRadiusPowerPoint = {
        x: (Math.max(shot.power,shot.minPower)/shot.maxPower)*aimRadius*Math.cos(-Math.PI * (shot.angle/180)),
        y: (Math.max(shot.power,shot.minPower)/shot.maxPower)*aimRadius*Math.sin(-Math.PI * (shot.angle/180))
      };



      ctx.moveTo(0,0);
      ctx.lineTo(aimRadiusPoint.x,aimRadiusPoint.y);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f55';
      ctx.moveTo(0,0);
      ctx.lineTo(aimRadiusPowerPoint.x,aimRadiusPowerPoint.y);
      
      ctx.stroke();

      ctx.beginPath();
      ctx.font = "10px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`angle: ${shot.angle}`, aimRadiusPoint.x,aimRadiusPoint.y);
      ctx.fillText(`power: ${shot.power}`, aimRadiusPowerPoint.x,aimRadiusPowerPoint.y);

      var East = getPointAtRadius(0,aimRadius);
      ctx.fillText("0", East.x,East.y-5);

      var North = getPointAtRadius(90,aimRadius);
      ctx.fillText("90", North.x,North.y-5);

      var West = getPointAtRadius(180,aimRadius);
      ctx.fillText("180", West.x,West.y-5);

      var South = getPointAtRadius(270,aimRadius);
      ctx.fillText("270", South.x,South.y-5);

        //Big Cross
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#555";

      ctx.moveTo(-1000,0);
      ctx.lineTo(1000,0);
      
      ctx.moveTo(0,-1000);
      ctx.lineTo(0,1000);
      
      ctx.stroke();
      
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