import React from 'react';
import styled from 'styled-components';
import Spinner from '../utils/Spinner';

const Wrapper = styled.div`
  margin: 1rem;
  text-align: center;
  margin-top: calc(30vh - 6rem);

  @media only screen and (max-width: 600px) {
    margin-top: calc(50vh - 6rem);
  }
`;

const Loading = () => (
  <Wrapper>
    <Spinner />
  </Wrapper>
);

export default Loading;
