class AngleControl extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <input
        placeholder="angle"
        id="angle_input"
        type="range"
        max="360"
        onChange={(event) => {
          let angleInput = event.target.value;
          if (!!Number(angleInput) || Number(angleInput) == 0) {
            shot.angle = angleInput;
          }
        }}
      />

    );
  }
}
