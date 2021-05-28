class FireButton extends React.Component {
    constructor(props) {
      super(props);
    }
  
    componentDidMount() {}
  
    render() {
      return (
        <button
          class="button"
          onClick={() => {
            console.log("fire", shot);
            socket.emit("fire", {
              angle: shot.angle,
              power: shot.power,
            });
          }}
        >
          Fire
        </button>
      );
    }
  }