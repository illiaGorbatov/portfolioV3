import React from 'react';
import styled from "styled-components";
import {animated, useSpring} from "react-spring";

const Wrapper = styled(animated.div)`
  position: absolute;
  bottom: 100px;
  overflow: hidden;
  height: 150px;
`;

const Text = styled(animated.div)`
  writing-mode: vertical-rl;
  height: 150px;
  transform: rotate(180deg);
  font-family: 'Made Evolve Sans Light';
  position: relative;
  font-size: 30px;
  color: white;
`;

const ScrollMessage = ({message, appear}) => {

    const appearing = useSpring({
        from: {left:  '-100px'},
        to: {left: '100px'}
    });

    const animation = useSpring({
        from: {bottom: 150},
        to: async (next) => {
            while (1) {
                await next({bottom: 0, immediate: false});
                await next({bottom: -150});
                await next({bottom: 150, immediate: true})
            }
        },
        reset: true
    })

    return (
        <Wrapper style={appearing}>
            <Text style={animation}>{message}</Text>
        </Wrapper>
    )
}

export default ScrollMessage