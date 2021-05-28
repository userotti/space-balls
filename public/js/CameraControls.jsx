
class CameraControls extends React.Component {
    render() {
      function zoomOut() {
        zoom.x *= 0.6;
        zoom.y *= 0.6;
      }
      function zoomIn() {
        zoom.x *= 1.4;
        zoom.y *= 1.4;
      }
      function panLeft() {
        pan.x += 250;
        lockOnPlayerId = false;
        followLastBullet = false;
        // document.getElementById("follow_bullet").style = "";
      }
      function panRight() {
        pan.x -= 250;
        lockOnPlayerId = false;
        followLastBullet = false;
        // document.getElementById("follow_bullet").style = "";
      }
      function panUp() {
        pan.y += 250;
        lockOnPlayerId = false;
        followLastBullet = false;
        // document.getElementById("follow_bullet").style = "";
      }
      function panDown() {
        pan.y -= 250;
        lockOnPlayerId = false;
        followLastBullet = false;
        // document.getElementById("follow_bullet").style = "";
      }
      function home() {
        lockOnPlayerId = true;
        followLastBullet = false;
        //   document.getElementById("follow_bullet").style = "";
      }
      return (
        <div class="camera-controls">
          <div class="button camera" onClick={zoomOut}>
            -
          </div>
          <div class="button camera" onClick={panUp}>
            up
          </div>
          <div class="button camera" onClick={zoomIn}>
            +
          </div>
          <div class="button camera" onClick={panLeft}>
            left
          </div>
          <div class="button camera" onClick={home}>
            home
          </div>
          <div class="button camera" id="pan_right" onClick={panRight}>
            right
          </div>
  
          <div class="button camera" id="pan_down" onClick={panDown}>
            down
          </div>
        </div>
      );
    }
  }