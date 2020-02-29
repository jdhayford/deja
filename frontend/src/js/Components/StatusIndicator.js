import React from "react";
import styled from 'styled-components';
import moment from 'moment';
import { WHITE, LIGHT_GRAY, LIGHT_RED, DARK_SILVER, GREEN, GO_GREEN } from '../utils/Colors';
import { Status } from '../services/fetchSessionStatus';

const Wrapper = styled.div`
  margin-top: 0.5rem;
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
      [Status.WAITING]: WHITE,
      [Status.HEALTHY]: GO_GREEN,
      [Status.FAILING]: LIGHT_RED, 
      [Status.OFFLINE]: LIGHT_GRAY, 
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