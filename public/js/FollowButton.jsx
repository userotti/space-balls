class FollowButton extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <button
        class="button"
        onClick={() => {
          followLastBullet = true;
          lockOnPlayerId = false;
        }}
      >
        Follow Bullet
      </button>
    );
  }
}
