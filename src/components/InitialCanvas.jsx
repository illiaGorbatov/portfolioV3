import React from 'react';
import {Canvas} from "react-three-fiber";
import LandscapeAllInOne from "./Landscape/LanscapeAllInOne";
import * as THREE from "three";
import RoadAllInOne from "./Road/RoadAllInOne";
import ExplosionAllInOne from "./Explosion/ExplosionAllInOne";

const InitialCanvas = (props) => {

    return (
        <Canvas
            camera={{ position: [0, 0, 35] }}
            style={{background: 'black'}}
            shadowMap
            onCreated={({scene}) => {
                scene.background = new THREE.Color('rgb(21, 22, 22)')
            }}
            concurrent={true}>
            <ExplosionAllInOne/>
        </Canvas>
    );
};

export default InitialCanvas;