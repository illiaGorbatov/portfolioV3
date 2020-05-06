import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {animated, useChain, useSprings, useTrail} from 'react-spring'

const NavScreen = styled.div`
  position: absolute;
  top: 0;
  color: white;
  min-height: 100%;
  min-width: 100%;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  z-index: 997;
`;

const BackgroundWrappers = styled(animated.div)`
  position: absolute;
  background-color: rgb(20, 20, 20);
  height: 100%;
  will-change: width;
`;

const WhiteStripes = styled(animated.div)`
  position: absolute;
  bottom: 0;
  background-color: blanchedalmond;
  width: 1px;
  will-change: height;
`;

const NavBar = styled.div`
  position: absolute;
  top: 50%;
  left: 70px;
  transform: translateY(-50%);
`;

const NavLink = styled(animated.div)`
  position: relative;
  font-weight: 300;
  font-size: 50px;
  margin-bottom: 10px;
  will-change: top, opacity;
`;

const Menu = styled.div`
  position: absolute;
  z-index: 999;
  top: 20px;
  right: 20px;
  color: white;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const navBlocks = ['', '', '', '', ''];
const stripesBlock = ['', '', '', ''];
const navLinks = ['Home', 'Portfolio', 'About', 'Contacts'];

const Navigation = (props) => {

    const [{innWidth, innHeight}, setWindowParameters] = useState({innWidth: window.innerWidth, innHeight: window.innerHeight});
    const updateWindowDimensions = () => {
        setWindowParameters({innWidth: window.innerWidth, innHeight: window.innerHeight});

    };
    useEffect(() => {
        window.addEventListener('resize', updateWindowDimensions);
        return () => {window.removeEventListener('resize', updateWindowDimensions)};
    });

    const [isMenuOpened, setState] = useState(true);

    const switchNavMenuAfterAnimation = () => {
        if (!isMenuOpened) {
            props.switchNavMenu()
        }
    };

    const config = {tension: 200,};
    const backgroundAnimRef = useRef();
    const backgroundAnim = useSprings(navBlocks.length, navBlocks.map((item, i) => ({
        ref: backgroundAnimRef,
        from: {width: `0px`, left: `${i * (innWidth / 5)}px`},
        to: async (next) => {
                await next({left: `${i * (innWidth / 5)}px`,
                    width: isMenuOpened ? `${innWidth / 5 + 3}px` : `0px`,});
                await switchNavMenuAfterAnimation();
        },
        config: config
    })));

    const stripesAnimRef = useRef();
    const stripesAnim = useSprings(stripesBlock.length, stripesBlock.map((item, i) => ({
        ref: stripesAnimRef,
        from: {height: `0px`, left: `${(i + 1) * (innWidth / 5)}px`},
        left: `${(i + 1) * (innWidth / 5)}px`,
        height: isMenuOpened ? `${innHeight}px` : `0px`,
        config: config
    })));

    const linksAppearingRef = useRef();
    const linksAppearing = useTrail(navLinks.length, ({
        ref: linksAppearingRef,
        from: {opacity: 0, top: '-50px'},
        opacity: isMenuOpened ? 1 : 0,
        top: isMenuOpened ? '0' : '-50px',
        config:config
    }));

    useChain(isMenuOpened ? ([backgroundAnimRef, stripesAnimRef, linksAppearingRef] ):
        [linksAppearingRef, stripesAnimRef, backgroundAnimRef], isMenuOpened ? [0, 0.5, 0.7] : [0, 0.2, 0.8]);

    return (
        <NavScreen>
            {backgroundAnim.map((animations, i) =>
                <BackgroundWrappers key={i} style={animations} />
            )}
            {stripesAnim.map((animations, i) =>
                <WhiteStripes key={i} style={animations} />
            )}
            <NavBar>
                {linksAppearing.map((animations, i) =>
                    <NavLink style={animations} key={i}>
                        {navLinks[i]}
                    </NavLink>
                )}
            </NavBar>
            <Menu onClick={() => {setState(!isMenuOpened)}}>
                Menu
            </Menu>
        </NavScreen>
    )
};

export default Navigation;