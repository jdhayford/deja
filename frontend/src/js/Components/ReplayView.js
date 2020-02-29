import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Player } from 'video-react';
import { Button } from "./styled";
import { Status } from "./SessionView";

const ViewPort = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5rem auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const AspectRatio = {
  width: 16,
  height: 9,
};

class ReplayView extends React.Component {
  getSaveButtonText() {
    switch (this.props.status) {
      case Status.READY:
        return 'Save';
      case Status.LOADING:
        return 'Saving...';
      case Status.DONE:
        return `Saved!`;
      default:
        return 'Uhh ohhh'
    }
  }

  getAspectRatio() {
    const isWidthLimited = window.innerHeight/AspectRatio.height < window.innerWidth/AspectRatio.width;
    return isWidthLimited ? {
      width: window.innerWidth*0.75,
    } : {
      height: window.innerHeight/2,
    };
  }

  render() {
    const { replay } = this.props;
    return (
      <ViewPort>
        <Player autoPlay playsInline loop muted {...this.getAspectRatio()} fluid={false}>
          <source src={replay.url} type="video/mp4" />
        </Player>
        <ButtonGroup>
          <Button onClick={() => !replay.saved && this.props.onSave()}>
            {this.getSaveButtonText()}
          </Button>
          <Button disabled={replay.saved} onClick={() => !replay.saved && this.props.onDiscard()} cancel>
            Discard
          </Button>
        </ButtonGroup>
      </ViewPort>
    );
  }
}

ReplayView.propTypes = {
  replay: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

ReplayView.defaultProps = {
  onSave: () => {},
  onDiscard: () => {},
};

export default ReplayView;