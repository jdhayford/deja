import React from "react";
import PropTypes from "prop-types";
import { Button } from "./styled";
import { Status } from "./SessionView";

class ReplayControls extends React.Component {
  getReplayButtonText() {
    switch (this.props.status) {
      case Status.READY:
        return 'Get Replay';
      case Status.LOADING:
        return 'Generating Replay...';
      case Status.DONE:
        return `Get Replay`;
      default:
        return 'Uhh ohhh'
    }
  }

  render() {
    return (
      <Button onClick={this.props.onGetReplay} secondary>
        {this.getReplayButtonText()}
      </Button>
    );
  }
}

ReplayControls.propTypes = {
  status: PropTypes.string.isRequired,
  onGetReplay: PropTypes.func.isRequired,
};

export default ReplayControls;