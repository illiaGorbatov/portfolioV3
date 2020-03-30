import React from 'react';
import {createGlobalStyle} from "styled-components";

const GlobalStyles = createGlobalStyle`
    * {
      box-sizing: border-box;
    };
    body {
      background-color: white;
      margin: 0;
      padding: 0;
      user-select: none
    };
   /* &::-webkit-scrollbar { 
    display: none;
    };
    html {
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    scrollbar-height: none; 
    }*/
`;

const App = () => {
  return (
      <GlobalStyles/>
  );
};

export default App;
