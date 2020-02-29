import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReplayControls from './ReplayControls';
import ReplayView from './ReplayView';
import ReplayList from './ReplayList';
import StatusIndicator from './StatusIndicator';
import { createReplay, saveReplay, fetchSessionStatus } from "../services";

import { MIST, DARK_SILVER, LIGHT_GREEN, D_GRAY } from '../utils/Colors';
import { SessionHeader, SessionCode, SessionLabel } from './styled';

const Wrapper = styled.div`
  margin: 1rem 0;
  text-align: center;
  flex-direction: column;
`;

export const Status = {
  INITIAL: 'initial',
  READY: 'ready',
  LOADING: 'loading',
  DONE: 'done',
  FAILED: 'failed',
};

class SessionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveStatus: Status.READY,
      replayStatus: Status.READY,
      replay: null,
    };

    this.getReplay = this.getReplay.bind(this);
    this.saveReplay = this.saveReplay.bind(this);
  }

  async getReplay() {
    const { session } = this.props;
    this.setState({ replayStatus: Status.LOADING });
    try {
      const replay = await createReplay(session.code);
      this.setState({
        replay,
        saveStatus: Status.READY,
        replayStatus: Status.READY,
      });
    } catch (e) {
      this.setState({ replayStatus: Status.FAILED });
    }
  }

  async saveReplay() {
    let { replay } = this.state;
    this.setState({ saveStatus: Status.LOADING });
    try {
      replay = await saveReplay(replay);
      this.setState({
        replay: null,
        replayStatus: Status.READY,
      });
    } catch (e) {
      this.setState({ saveStatus: Status.FAILED });
    }
    await this.props.update();
  }

  render() {
    const { session, status, replays } = this.props;
    return (
      <Wrapper>
        <SessionHeader>
          <SessionCode>
            {session.code}
          </SessionCode>
          <SessionLabel>active session</SessionLabel>
          {status && <StatusIndicator status={status} />}
        </SessionHeader>

        <ReplayControls
          status={this.state.replayStatus}
          onGetReplay={this.getReplay}
        />

        {this.state.replay && (
          <ReplayView
            replay={this.state.replay}
            status={this.state.saveStatus}
            onSave={this.saveReplay}
            onDiscard={() => this.setState({ replay: null })}
          />
        )}
        {replays.length > 0 && <ReplayList replays={replays} />}
      </Wrapper>
    )
  }
}

SessionView.propTypes = {
  session: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  replays: PropTypes.array.isRequired,
  update: PropTypes.func.isRequired,
};

export default SessionView;
