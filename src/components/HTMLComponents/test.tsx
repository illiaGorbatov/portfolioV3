import React from 'react';
import styled from "styled-components/macro";
import {useStore} from "../../utils/zustandStore";

const ButtonsWrapper = styled.div`
  position: absolute;
  top: 200px;
  left: 200px;
  z-index: 1000;
`;

const Button = styled.div<{ $color: string }>`
  width: 50px;
  height: 50px;
  background-color: ${props => props.$color};
`;

const TestButton = () => {

    const setCurrentScene = useStore(state => state.setCurrentScene);
    const setExploded = useStore(state => state.setExploded);
    const test = () => {
        setCurrentScene({currentScene: 'explosion', previousScene: 'landscape'})
    }

    const setProgress = () => {
        setExploded(true)
    }

    return (
        <ButtonsWrapper>
            <Button onClick={test} $color={'red'}/>
            <Button onClick={setProgress} $color={'green'}/>
        </ButtonsWrapper>
    )
}

export default TestButton