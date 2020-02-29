import styled, { css } from "styled-components";
import { DARK_SLATE, DARK_SILVER, LIGHT_RED, LIGHT_GREEN, LIGHT_BLUE } from "../utils/Colors";

export const SessionHeader = styled.div`
  text-align: center;
  flex-direction: column;
`;

export const SessionCode = styled.div`
  border-bottom: 1px solid ${DARK_SILVER};
  border-radius: 0.25rem;
  color: ${LIGHT_GREEN};
  display: flex;
  justify-content: center;
  width: fit-content;
  max-width: 16rem;
  padding: 0.25rem 1rem;
  margin: auto;
  margin-top: 0.25rem;
`;

export const SessionLabel = styled.div`
  color: ${DARK_SILVER};
  font-size: 1rem;
  margin: auto;
`;

export const Button = styled.div`
  display: flex;
  margin: auto;
  height: 2rem;
  min-width: 10rem;
  color: ${DARK_SLATE};

  background-color: ${LIGHT_GREEN};
  font-size: 1.25rem;
  line-height: 1.25rem;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  cursor: pointer;
  padding: 0 1rem;
  max-width: 12rem;
  margin-top: 1rem;

  ${(props) => props.secondary && css`
    background-color: ${LIGHT_BLUE};
  `}

  ${(props) => props.cancel && css`
    margin-left: 1rem;
    background-color: ${LIGHT_RED};
  `}

  ${(props) => props.disabled && css`
    opacity: 0.5;
    cursor: default;
  `}
`;