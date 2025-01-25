import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', 'Roboto', sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: #f5f5f5;
    overflow-x: hidden;
  }

  button {
    font-family: inherit;
    border: none;
    outline: none;
    cursor: pointer;
  }

  /* Remove default button styles */
  button:focus {
    outline: none;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Better text rendering */
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
