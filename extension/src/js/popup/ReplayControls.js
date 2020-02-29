import React from "react";
import PropTypes from "prop-types";
import { Button } from "./styled";
import { Status } from "./Controller";
import { SessionStatus } from "../services";

const isHealthy = status => status === SessionStatus.HEALTHY;

export class ReplayControls extends React.PureComponent {
  getReplayButtonText() {
    const { status, sessionStatus } = this.props;

    if (!isHealthy(sessionStatus)) {
      return 'Seeking stream...';
    }

    switch (status) {
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
    const { onGetReplay, sessionStatus } = this.props
    return (
      <Button
        onClick={() => isHealthy(sessionStatus) && onGetReplay()}
        disabled={!isHealthy(sessionStatus)}
        secondary
      >
        {this.getReplayButtonText()}
      </Button>
    );
  }
}

ReplayControls.propTypes = {
  status: PropTypes.string.isRequired,
  sessionStatus: PropTypes.string.isRequired,
  onGetReplay: PropTypes.func.isRequired,
};