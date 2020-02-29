import { createGlobalStyle } from 'styled-components';
import FreeSans from '../../fonts/FreeSans.ttf';
import FreeSansBold from '../../fonts/FreeSansBold.otf';
import { SILVER } from './Colors';

const MAIN_FONT = "'Roboto', sans-serif";

const GlobalCssStyles = createGlobalStyle`
  @font-face {
    font-family: 'FreeSans';
    src: url('${FreeSans}') format('truetype');
  }

  @font-face {
    font-family: 'FreeSansBold';
    src: url('${FreeSansBold}') format('truetype');
  }

  body {
    font-family: ${MAIN_FONT};
    background: black;
    margin: 0;
  }
`;

export default GlobalCssStyles;
