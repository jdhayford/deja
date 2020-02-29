import React from "react";
import styled from "styled-components";
import { getCurrentTab } from "./utils";
import { SessionButton } from "./SessionButton";
import { ReplayControls } from "./ReplayControls";
import { ReplayView } from "./ReplayView";
import StatusIndicator from "./StatusIndicator";
import { newReplay, fetchSessionStatus, SessionStatus } from "../services";
import { getSiteUrl } from "../background/config";
import { SILVER, LIGHT_BLUE } from "./colors";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const Option = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  color: ${SILVER};
  text-align: center;

  span {
    color: ${LIGHT_BLUE};
    font-size: 1rem;
    margin-top: 0.5rem;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const Status = {
  INITIAL: 'initial',
  READY: 'ready',
  LOADING: 'loading',
  DONE: 'done',
  FAILED: 'failed',
};

const seconds = (numSeconds) => 1000*numSeconds;

class Controller extends React.Component {
  constructor(props) {
    super(props);
    this.port = chrome.extension.connect({ name: 'Session -> Background' });
    this.state = {
      sessionStatus: SessionStatus.INITIAL,
      replayStatus: Status.READY,
      sessionName: null,
      replayURL: null,
      sessionUrl: null,
    };

    this.startSession = this.startSession.bind(this);
    this.getReplay = this.getReplay.bind(this);
    this.receiveSession = this.receiveSession.bind(this);
    this.pollSessionStatus = this.pollSessionStatus.bind(this);
    this.statusLoop = null;
    this.port.onMessage.addListener(this.receiveSession);
    this.checkCurrentSession();
  }

  async pollSessionStatus() {
    const { sessionName } = this.state;
    if (!sessionName) return;
    const status = await fetchSessionStatus(sessionName);
    this.setState({ sessionStatus: status });

    const timeout = {
      [SessionStatus.WAITING]: seconds(5),
      [SessionStatus.HEALTHY]: seconds(5),
      [SessionStatus.FAILING]: seconds(10),
    }[status];
    if (timeout) setTimeout(this.pollSessionStatus, timeout);
  }

  async receiveSession(session) {
    const sessionName = session.code;
    const baseSite = await getSiteUrl();
    const sessionUrl = `${baseSite}sessions/${sessionName}`;
    this.setState({ sessionUrl, sessionName });
    this.pollSessionStatus();
  }

  async checkCurrentSession() {
    const currentTab = await getCurrentTab()
    this.port.postMessage(currentTab);
  }

  async startSession() {
    this.setState({ sessionStatus: SessionStatus.WAITING });
    this.checkCurrentSession();
  }

  async getReplay() {
    const { sessionName } = this.state;
    this.setState({ replayStatus: Status.LOADING });
    try {
      const replay = await newReplay(sessionName);
      this.setState({
        replayStatus: Status.READY,
        replayURL: replay.url,
      });
    } catch (e) {
      this.setState({ replayStatus: Status.FAILED });
    }
  }

  render() {
    const { sessionName, sessionStatus, sessionUrl, replayStatus, replayURL } = this.state;
    return (
      <Container>
        <SessionButton
          onSessionStart={this.startSession}
          sessionName={sessionName}
          status={sessionStatus}
        />
        {sessionName && <StatusIndicator status={sessionStatus} />}
        {sessionName && (
          <ReplayControls
            onGetReplay={this.getReplay}
            status={replayStatus}
            sessionStatus={sessionStatus}
          />
        )}
        {replayURL && (
          <ReplayView source={replayURL} />
        )}

        {sessionName &&  (
          <Option>or get the full experience at 
            <span onClick={() => window.open(sessionUrl)}>{sessionUrl}</span>
          </Option>
        )}
        
      </Container>
    );
  }
}

export default Controller;