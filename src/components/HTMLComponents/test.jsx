import React from 'react';
import styled from "styled-components/macro";
import {useStore} from "../../utils/zustandStore";

const Button = styled.div`
  position: absolute;
  top: 200px;
  left: 200px;
  width: 100px;
  height: 100px;
  background-color: yellow;
  z-index: 1000;
`;

const TestButton = () => {

    const setCurrentScene  = useStore(state => state.setCurrentScene);
    const test = () => {
        setCurrentScene({currentScene: 'explosion', previousScene: 'landscape'})
    }

    return (
        <Button onClick={test}/>
    )
}

export default TestButton