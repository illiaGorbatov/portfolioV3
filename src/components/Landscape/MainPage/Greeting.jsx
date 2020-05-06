import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {animated, useSprings} from "react-spring";
import ScrollMessage from "../../HTMLComponents/NavMenu/Scroll";

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const TextWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const OrdinaryGreeting = styled(animated.div)`
  text-align: center;
  font-family: ${props => props.evo ? 'Made Evolve Sans Light EVO' : 'Made Evolve Sans Light'};
  font-size: 80px;
  color: ${props => props.evo ? 'red' : 'white'};
`;

const text = ['Приветствую', 'Меня зовут Илья', 'и я', 'REACT-РАЗРАБОТЧИК']

const Greeting = () => {

    const [index, setIndex] = useState(0);
    const [hudEnabled, setHud] = useState(false);

    const [springs, setSprings] = useSprings(text.length, i => ({
        from: {
            scale: 3,
            opacity: 0,
            bottom: '-50vh'
        }
    }));

    const appearing = (index) => {
        setSprings(i => {
            if (i === index && i !== text.length - 1) {
                return {
                    to: async (next) => {
                        await next({scale: 1, opacity: 1});
                        await next({scale: 0.1, opacity: 0})
                        await setIndex(index + 1);
                    }
                }
            } else if (i === index && i === text.length - 1) {
                return {
                    to: async (next) => {
                        await next({scale: 1, opacity: 1});
                        await next({bottom: `0vh`});
                        await setHud(true)//разобраться
                    }
                }
            } else return
        });
    };
    useEffect(() => {
        appearing(index)
    }, [index]);

    return (
        <PageWrapper>
            {springs.map(({scale, opacity, bottom}, i) =>
                <TextWrapper key={i}>
                    <OrdinaryGreeting evo={i === text.length - 1} style={{
                        opacity,
                        transform: scale.interpolate(s => `scale(${s})`)
                    }}>
                        {text[i]}
                    </OrdinaryGreeting>
                </TextWrapper>
            )}
            {hudEnabled && <ScrollMessage message={'Обо мне'} appear={true}/>}
        </PageWrapper>
    )
};

export default Greeting