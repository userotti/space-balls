
class CanvasComponent extends React.Component {
    constructor(props) {
      super(props);
      this.canvasRef = React.createRef();
    }
  
    componentDidMount() {
      this.canvas = this.canvasRef.current;
      ctx = this.canvas.getContext("2d");
    }
  
    render() {
      function mouseDown(event) {
        aiming.mousedown.x = event.nativeEvent.offsetX;
        aiming.mousedown.y = event.nativeEvent.offsetY;
        aiming.active = true;
      }
      function mouseUp(event) {
        aiming.mouseup.x = event.nativeEvent.offsetX;
        aiming.mouseup.y = event.nativeEvent.offsetY;
  
        aiming.active = false;
  
        shot.power =
          Math.sqrt(
            Math.pow(aiming.mousedown.y - aiming.mouseup.y, 2) +
              Math.pow(aiming.mousedown.x - aiming.mouseup.x, 2)
          ) * 0.05;
  
        shot.angle = Math.atan2(
          aiming.mousedown.y - aiming.mouseup.y,
          -1 * (aiming.mousedown.x - aiming.mouseup.x)
        );
        shot.angle = ((shot.angle + Math.PI) * 180) / Math.PI;
  
        // let powerInput = document.getElementById("power_input");
        // let angleInput = document.getElementById("angle_input");
  
        // powerInput.value = shot.power;
        // angleInput.value = shot.angle;
      }
  
      function mouseMove(event) {
        aiming.mousemove.x = event.nativeEvent.offsetX;
        aiming.mousemove.y = event.nativeEvent.offsetY;
      }
  
      function wheel(event) {
        zoom.x *= event.deltaY > 0 ? 0.6 : 1.4;
        zoom.y *= event.deltaY > 0 ? 0.6 : 1.4;
      }
  
      return (
        <canvas
          ref={this.canvasRef}
          d="canvas"
          height="600"
          width="600"
          onMouseDown={mouseDown}
          onMouseUp={mouseUp}
          onMouseMove={mouseMove}
          onWheel={wheel}
        />
      );
    }
  }