import React from 'react';
import {createGlobalStyle} from "styled-components";
import styled from "styled-components";
import Road from "./components/Road/Road";
import Explosion from "./components/Explosion/Explosion";


const GlobalStyles = createGlobalStyle`
    * {
      box-sizing: border-box;
    };
    body {
      background-color: white;
      margin: 0;
      padding: 0;
      user-select: none;
      outline: none;
      
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
        <>
            <GlobalStyles/>
            <Wrapper>
                <Explosion/>
            </Wrapper>
        </>
    );
};

export default App;
