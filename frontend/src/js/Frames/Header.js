import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DejaLogo from '../../images/deja.v3.small.svg';
import { RED, MIST, WHITE } from '../utils/Colors';

const Wrapper = styled.div`
  background-color: ${MIST};
  height: 3rem;
  text-align: center;
  box-sizing: border-box;
  padding-top: 0.4rem;

  & a {
    text-decoration: none !important;
  }

  @media only screen and (max-width: 600px) {
    text-align: left;
  }
`;

const Logo = styled.img`
  height: 2.5rem;

  @media only screen and (max-width: 600px) {
    margin-left: 0.5rem;
  }
`;

const Header = ({ currentUser }) => (
  <Wrapper>
    <Link to="/">
      <Logo src={DejaLogo} />
    </Link>
  </Wrapper>
);

export default Header;
