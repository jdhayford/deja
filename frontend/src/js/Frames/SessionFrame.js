import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { push } from 'connected-react-router';
import { errorToast } from '../utils/toast';
import { fetchSession, fetchSessionStatus, fetchSessionReplays } from '../services';
import Spinner from '../utils/Spinner';
import SessionView from '../Components/SessionView';

import { getReplays } from '../store';
import { MIST, GO_GREEN, D_GRAY } from '../utils/Colors';

const Wrapper = styled.div`
  margin: 1rem;
  text-align: center;
  margin-top: 1rem;
  flex-direction: column;
  color: ${MIST};
`;

const SpinnerWrapper = styled.div`
   margin-top: calc(50vh - 6rem);
`;

class SessionFrame extends React.Component {
  constructor(props) {
    super(props);
    this.updateSessionData = this.updateSessionData.bind(this);
  }

  async componentDidMount() {
    await this.updateSessionData();
  }
  
  async updateSessionData() {
    const { match, dispatch, session, replays } = this.props;
    const { params: { code } } = match;
    if (session === null) {
      try {
        await fetchSession(dispatch, code)
        fetchSessionStatus(dispatch, code);
        fetchSessionReplays(dispatch, code);
      } catch (e) {
        console.error(e);
        errorToast(`No session found with the code: ${code}`);
      }
    }
  }

  render() {
    const { match, dispatch, session, sessionStatus, replays } = this.props;
    const { params: { code } } = match;
    return (
      <Wrapper>
        {session === null ? (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : ( 
          <SessionView
            session={session}
            status={sessionStatus}
            replays={replays}
            update={() => fetchSessionReplays(dispatch, code)}
          />
        )}
      </Wrapper>
    )
  }
}

SessionFrame.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      code: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  session: PropTypes.object,
  sessionStatus: PropTypes.object,
  replays: PropTypes.array,
};

SessionFrame.defaultProps = {
  session: null,
  sessionStatus: null,
  replays: null,
};

const mapStateToProps = (state) => ({
  session: state.session,
  sessionStatus: state.sessionStatus,
  replays: getReplays(state),
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(SessionFrame);
