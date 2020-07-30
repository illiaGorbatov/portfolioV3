import React from 'react';
import {Canvas} from "react-three-fiber";
import * as THREE from "three";
import TransitionsBetweenScenes from "./CameraScript/TransitionsBetweenScenes";

const InitialCanvas = () => {

    return (
        <Canvas
            style={{background: 'black'}}
            shadowMap
            onCreated={({scene}) => {
                scene.background = new THREE.Color('rgb(21, 22, 22)')
            }}
            concurrent={true}>
            <TransitionsBetweenScenes/>
        </Canvas>
    );
};

export default InitialCanvas;