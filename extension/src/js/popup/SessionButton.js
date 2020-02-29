import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "./styled";
import { LIGHT_GREEN, DARK_SILVER, SILVER } from "./colors";
import { getSiteUrl } from "../background/config";
import { SessionStatus } from "../services";

const Wrapper = styled.div`
  flex-direction: column;
  font-size: 1.25rem;
  color: ${SILVER};
  text-align: center;
`;

const Info = styled.div`
  font-size: 1rem;
`;

const SessionDisplay = styled.div`
  border: 1px solid ${DARK_SILVER};
  border-radius: 0.25rem;
  color: ${LIGHT_GREEN};
  width: 10rem;
  padding: 0.25rem;
  cursor: pointer;
  margin: auto;
  margin-top: 0.25rem;
`;

export class SessionButton extends React.Component {
  getSessionButtonText() {
    const { status } = this.props;

    switch (status) {
      case SessionStatus.READY:
        return 'Start Session';
      case SessionStatus.INITIAL:
      case SessionStatus.LOADING:
        return 'Checking for stream...';
      case SessionStatus.HEALTHY:
        return `Session: ${this.props.sessionName}`;
      default:
        return 'Uhh ohhh'
    }
  }

  async openSessionPage() {
    const { sessionName } = this.props;
    const baseSite = await getSiteUrl();
    window.open(`${baseSite}sessions/${sessionName}`)
  }

  render() {
    const { sessionName, status, onSessionStart } = this.props;
    if (status.INITIAL) return null;
    return sessionName ?  (
      <Wrapper>
        <Info>
          Active Session:
        </Info>
        <SessionDisplay onClick={() => this.openSessionPage()}>
          {sessionName}
        </SessionDisplay>
      </Wrapper>
    ) : (
      <Button onClick={onSessionStart}>
        {this.getSessionButtonText()}
      </Button>
    );
  }
}
SessionButton.propTypes = {
  sessionName: PropTypes.string,
  status: PropTypes.string.isRequired,
  onSessionStart: PropTypes.func.isRequired,
};

SessionButton.defaultProps = {
  sessionName: '',
};
