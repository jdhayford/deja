import styled, { css, createGlobalStyle } from "styled-components";
import { DARK_SLATE, LIGHT_GREEN, LIGHT_BLUE } from "./colors";

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${DARK_SLATE};
    font-family: 'Roboto', sans-serif;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
  min-width: 20rem;
  justify-content: center;
`;

export const Button = styled.div`
  display: flex;
  margin: auto;
  height: 3rem;
  min-width: 10rem;
  background-color: ${LIGHT_GREEN};
  font-size: 1.25rem;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  cursor: pointer;
  padding: 0 1rem;

  opacity: ${(props) => props.disabled ? 0.3 : 1};
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};

  ${(props) => props.secondary && css`
    margin-top: 1rem;
    height: 2rem;
    min-width: 8rem;
    background-color: ${LIGHT_BLUE};
  `}
`;