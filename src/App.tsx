import React, {useEffect, useState} from 'react';
import {createGlobalStyle} from "styled-components";
import styled from "styled-components";
import InitialCanvas from "./components/ThreeJSComponents/InitialCanvas";
import Header from "./components/HTMLComponents/NavMenu/Header";
import {getState} from "./utils/zustandStore";
import TestButton from "./components/HTMLComponents/test";


const GlobalStyles = createGlobalStyle`
    * {
      box-sizing: border-box;
    };
    body {
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
    position: absolute;
    z-index: -1;
`;

const App = () => {

    const [isNavMenuOpened, openAndCloseNavMenu] = useState(false);
    const switchNavMenu = () => {
        openAndCloseNavMenu(!isNavMenuOpened)
    };
    /*const onScrollHandler = (e, ref) => {
        let scrolled = window.scrollY / (ref.current.scrollHeight - window.innerHeight);
        getState().scroll(scrolled);
    };*/

    useEffect(() => {
        const onMouseMoveHandler = (e:  MouseEvent)  => {
            getState().mouseMove([e.clientX, e.clientY])
        }
        window.addEventListener('mousemove',onMouseMoveHandler);
        return(() => window.removeEventListener('mousemove',onMouseMoveHandler))
    }, []);

    return (
        <>
            <GlobalStyles/>
            <Wrapper>
                <TestButton/>
                <InitialCanvas/>
            </Wrapper>
            <Header switchNavMenu={switchNavMenu} isNavMenuOpened={isNavMenuOpened}/>
        </>
    );
};

export default App;
