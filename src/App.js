import React, {useEffect, useState} from 'react';
import {createGlobalStyle} from "styled-components";
import styled from "styled-components";
import InitialCanvas from "./components/InitialCanvas";
import Made from "./assets/fonts/MADE-EvolveSansLight.otf";
import MadeEvo from "./assets/fonts/MADE-EvolveSansLightEVO.otf";
import Anders from "./assets/fonts/Anders.ttf";
import Garamond from "./assets/fonts/garamond.ttf";
import Greeting from "./components/Landscape/MainPage/Greeting";
import Header from "./components/HTMLComponents/NavMenu/Header";
import {getState} from "./utils/zustandStore";
import AboutMe from "./components/Landscape/MainPage/AboutMe";


const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: 'Made Evolve Sans Light';
        font-style: normal;
        font-weight: normal;
        src: url(${Made});
    };
    @font-face {
        font-family: 'Made Evolve Sans Light EVO';
        font-style: normal;
        font-weight: normal;
        src: url(${MadeEvo});
    };
    @font-face {
        font-family: "Anders";
        src: url(${Anders});
        font-style: normal;
        font-weight: normal;
    };
    @font-face {
        font-family: 'Garamond';
        font-style: normal;
        font-weight: normal;
        src: url(${Garamond});
    };
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
    position: absolute;
    z-index: -1;
`;

const App = () => {

    const [isNavMenuOpened, openAndCloseNavMenu] = useState(false);
    const switchNavMenu = () => {
        openAndCloseNavMenu(!isNavMenuOpened)
    };
    const onScrollHandler = (e, ref) => {
        let scrolled = window.scrollY / (ref.current.scrollHeight - window.innerHeight);
        getState().scroll(scrolled);
    };

    const onMouseMoveHandler = e => {
        getState().mouseMove([e.clientX, e.clientY])
    }
    useEffect(() => {
        window.addEventListener('mousemove',onMouseMoveHandler);
        return(() => window.removeEventListener('mousemove',onMouseMoveHandler))
    })

    return (
        <>
            <GlobalStyles/>
            <Wrapper>
                <InitialCanvas/>
            </Wrapper>
            {/*<Greeting/>*/}
            {/*<AboutMe/>*/}
            <Header switchNavMenu={switchNavMenu} isNavMenuOpened={isNavMenuOpened}/>
        </>
    );
};

export default App;
