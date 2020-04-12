import React from 'react';
import {createGlobalStyle} from "styled-components";
import styled from "styled-components";
import FirstScene from "./components/myFirstScene/firstScene";
import Landscape from "./components/Landscape/landscape";


const GlobalStyles = createGlobalStyle`
    * {
      box-sizing: border-box;
    };
    body {
      background-color: white;
      margin: 0;
      padding: 0;
      user-select: none;
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

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
`;

const App = () => {
    return (
        <Wrapper>
            <GlobalStyles/>
            <Landscape/>
        </Wrapper>
    );
};

export default App;
