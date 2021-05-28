class PowerControl extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <input
          placeholder="power"
          id="power_input"
          type="range"
          max="30"
          onChange={(event) => {
            let powerInput = event.target.value;
            if (!!Number(powerInput) || Number(powerInput) == 0) {
              shot.power = powerInput;
              shot.power = Math.min(
                Math.max(shot.power, shot.minPower),
                shot.maxPower
              );
            }
          }}
        />
      );
    }
  }