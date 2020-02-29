import React from "react";
import ReactDOM from "react-dom";
import Controller from "./popup/Controller"
import { GlobalStyle, Container } from "./popup/styled";
import DejaLogo from "../img/deja-white.svg";
import "../img/deja.png";

const App = () => (
  <Container>
    <GlobalStyle />
    <img src={DejaLogo} alt='Deja' />
    <Controller />
  </Container>
)

ReactDOM.render(<App />, document.getElementById('root') || document.createElement('div'));