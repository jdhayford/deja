import React from 'react';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import SessionFrame from './SessionFrame';
import Landing from './Landing';
import { D_GRAY, DARK_SLATE } from '../utils/Colors';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 1.5rem;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;

const Content = styled.div`
  background-color: ${D_GRAY};
  min-height: calc(100vh - 3rem);
  width: 100%;
  margin: auto;
`;

const Main = () => {
  return (
    <Wrapper>
      <Header />
      <Content>
        <Switch>
          <Route path="/" component={Landing} exact />
          <Route path="/sessions/:code" component={SessionFrame} />
        </Switch>
      </Content>
    </Wrapper>
  );
};

export default Main;
