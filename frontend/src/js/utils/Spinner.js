import React from 'react';
import styled from 'styled-components';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';

import { RED } from '../utils/Colors';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Spinner = () => <ClipLoader css={override} sizeUnit="rem" size={4} color={RED} loading />;

export default Spinner;
