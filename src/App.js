import React from 'react';
import {createGlobalStyle} from "styled-components";
import styled from "styled-components";
import {Canvas} from "react-three-fiber";
import Cubes from "./components/cubes/index";
import Lights from "./components/light/light";
import Environment from "./components/environment/environment";


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
            <Canvas>
                <Cubes/>
                <Lights/>
                <Environment/>
            </Canvas>
        </Wrapper>
    );
};

export default App;
