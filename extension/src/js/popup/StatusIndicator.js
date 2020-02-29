import React from "react";
import styled from 'styled-components';
import { WHITE, LIGHT_GRAY, LIGHT_RED, DARK_SILVER, GO_GREEN } from './colors';
import { SessionStatus } from '../services/fetchSessionStatus';

const Wrapper = styled.div`
  margin-top: 1rem;
  color: ${DARK_SILVER};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  font-size: 1rem;
`;

const Orb = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 0.5rem;
  margin: 0 0.5rem;
  background-color: ${(props) => (
    {
      [SessionStatus.WAITING]: WHITE,
      [SessionStatus.HEALTHY]: GO_GREEN,
      [SessionStatus.FAILING]: LIGHT_RED, 
      [SessionStatus.OFFLINE]: LIGHT_GRAY, 
    }[props.status]
  )}
`;

const StatusIndicator = ({ status }) => (
  <Wrapper>
    <Orb status={status} />
    <div>
      {status.toLowerCase()}
    </div>
  </Wrapper>
);

export default StatusIndicator;