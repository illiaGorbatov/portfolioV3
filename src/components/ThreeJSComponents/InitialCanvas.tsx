import React from 'react';
import {Canvas} from "react-three-fiber";
import * as THREE from "three";
import TransitionsBetweenScenes from "./TransitionsBetweenScenes";

const InitialCanvas = () => {

    return (
        <Canvas
            style={{background: 'black'}}
            shadowMap
            onCreated={({scene}) => {
                scene.background = new THREE.Color(0x333333);
            }}
            concurrent={true}>
            {/*<ambientLight intensity={1} color={0xffffff}/>*/}
            <fog attach="fog" args={[0x333333, 10, 400]} />
            <TransitionsBetweenScenes/>
        </Canvas>
    );
};

export default InitialCanvas;