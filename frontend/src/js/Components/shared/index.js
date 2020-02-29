import styled from 'styled-components';
import { SILVER } from '../../utils/Colors';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Button = styled.div`
  background-color: ${SILVER};
  display: flex;
  cursor: pointer;
  align-items: center;
  border-radius: 0.2rem;
  font-size: 1.25rem;
  line-height: 1.25rem;
  height: 2rem;
  margin: 0 1rem;
  padding: 0 0.5rem;
  justify-content: center;
  min-width: 8rem;
  overflow: hidden;
`;
