import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { SILVER, DARK_SLATE, MATTE_GREY, WHITE } from '../utils/Colors';

const Wrapper = styled.div`
  border-radius: 0.25rem;
  background-color: ${WHITE};
  display: flex;
  font-size: 1.25rem;

  margin: 0 1rem;
  padding: 0.5rem 0;
  min-width: 40%;
  box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.16), 0 1.5px 3px rgba(0, 0, 0, 0.23);
  overflow: hidden;

  @media only screen and (max-width: 1200px) {
    min-width: 45%;
    margin-bottom: 1.5rem;
  }

  @media only screen and (max-width: 600px) {
    border-radius: 0;
    margin-left: 0;
    margin-right: 0;
    min-width: 100%;
  }
`;

const TopArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0.5rem;
  width: 100%;
`;

const DateBadge = styled.div`
  border-radius: 0.25rem;
  background-color: ${SILVER};
  color: ${DARK_SLATE};
  justify-content: center;
  line-height: 2.25rem;
  text-align: center;
  height: 2.25rem;
  width: 3.25rem;
  margin: 0 0.5rem;
`;

const DateSeperator = styled.span`
  margin: 0 1px;
`;

const Header = styled.div`
  display: flex;
  flex: 2;
  flex-direction: column;
  margin: 0 1rem;
`;

const Day = styled.div`
  color: ${MATTE_GREY};
  font-size: 1.25rem;
`;

const Program = styled.div`
  font-size: 1rem;
`;

const Time = styled.div`
  font-size: 1.25rem;
  color: ${MATTE_GREY};
`;

const dayOf = (date) => date.format('dddd');
const monthOf = (date) => date.format('M');
const dateOf = (date) => date.format('D');
// const timeOf = (date) => date.format('hh:mm z');
const timeOf = () => '9:00 AM';

const SessionCard = ({ time, program }) => (
  <Wrapper>
    <TopArea>
      <DateBadge>
        {monthOf(time)}
        <DateSeperator>/</DateSeperator>
        {dateOf(time)}
      </DateBadge>
      <Header>
        <Day>{dayOf(time)}</Day>
        <Program>{program.name}</Program>
      </Header>
      <Time>{timeOf()}</Time>
    </TopArea>
  </Wrapper>
);

SessionCard.propTypes = {
  time: PropTypes.object.isRequired,
  program: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default SessionCard;
