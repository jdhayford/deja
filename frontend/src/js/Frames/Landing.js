import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { push } from 'connected-react-router';
import { errorToast } from '../utils/toast';
import { fetchSession, fetchSessionReplays } from '../services';

import {  } from '../services';
import { MIST, GO_GREEN, D_GRAY } from '../utils/Colors';

const Wrapper = styled.div`
  margin: 1rem;
  text-align: center;
  margin-top: calc(30vh - 6rem);
  flex-direction: column;
  color: ${MIST};

  @media only screen and (max-width: 600px) {
    margin-top: calc(50vh - 6rem);
  }
`;

const Prompt = styled.div`
  margin-bottom: 0.5rem;
  text-align: center;

  @media only screen and (max-width: 600px) {
    margin-top: calc(50vh - 6rem);
  }
`;

const StyledInput = styled.input`
  display: flex;

  color: ${D_GRAY};
  text-align: center;
  justify-content: center;
  height: 2rem;
  border-style: solid;
  line-height: 2rem;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  margin: auto;

  :focus {
    outline: none;
  }
`;

const CodeInput = styled(StyledInput)`
  margin-bottom: 0.5rem;
  width: 15rem;
  
  @media only screen and (max-width: 600px) {
  }
`;

const Submit = styled(StyledInput)`
  background-color: ${GO_GREEN};
  font-size: 1.5rem;
  width: 10rem;
  cursor: pointer;
  border: none;

  @media only screen and (max-width: 600px) {
  }
`;

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({code: event.target.value});
  }

  async handleSubmit(event) {
    const { dispatch } = this.props;
    const { code } = this.state;
    event.preventDefault();

    try {
      await fetchSession(dispatch, code);
      await fetchSessionReplays(dispatch, code);
      this.props.history.push(`sessions/${code}`);
    } catch (e) {
      errorToast(`No session found with the code: ${code}`)
    }
  }

  render() {
    return (
      <Wrapper as="form" onSubmit={this.handleSubmit}>
        <Prompt>Please enter your session code:</Prompt>
        <CodeInput value={this.state.value} onChange={this.handleChange} />
        <Submit as="button" type="submit">Go</Submit>
      </Wrapper>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(null, mapDispatchToProps)(Landing);
