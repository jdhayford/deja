import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import styled from "styled-components";
import { Player } from 'video-react';
import { BABY_GRAY, DARK_GRAY, BLUE, MIST, WHITE } from '../utils/Colors';
import TimeAgo from 'react-timeago'


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${DARK_GRAY};
  margin: 1rem auto 5rem;
`;

const Title = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: ${MIST};
  border-top: 1px solid ${MIST};
  font-size: 20px;
  padding: 1rem 8rem;
`;

const Grid = styled.div`
  display: flex;
  align-items: center; 
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 auto 5rem;
`;

const ReplayCard = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  background-color: ${MIST};
  border-radius: 0.2rem;

  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);

  &:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
`;

const Description = styled.div`
  display: flex;
  align-items: center; 
  justify-content: space-between;
  padding: 0.5rem;
  font-size: 18px;
`;

const Download = styled.a`
  text-decoration: none;
  color: ${BLUE};
`;

class ReplayList extends React.PureComponent {
  render() {
    const width = Math.min(window.innerWidth-80, 480);
    return (
      <Wrapper>
        <Title>All Session Replays</Title>
        <Grid>
          {this.props.replays.map((replay, i) => (
            <ReplayCard key={`replay-${i}`}>
              <Player playsInline loop muted width={width} fluid={false}>
                <source src={replay.url} type="video/mp4" />
              </Player>
              <Description>
                <div>
                  <Download href={replay.url} download="replay">Download</Download>
                </div>
                <div><TimeAgo date={moment(replay.createdAt).format('LLL')} /></div>
              </Description>
            </ReplayCard>
          ))}
        </Grid>
      </Wrapper>
    );
  }
};

ReplayList.propTypes = {
  replays: PropTypes.array.isRequired,
};

ReplayList.defaultProps = {
  replays: [],
};

export default ReplayList;