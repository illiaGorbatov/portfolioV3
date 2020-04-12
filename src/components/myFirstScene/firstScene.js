import React, {Suspense} from 'react';
import {Canvas} from "react-three-fiber";
import Cubes from "./cubes/index";
import Lights from "./light/light";
import Environment from "./environment/floor";
import Controls from "../controls/controls";
import * as THREE from 'three';

const FirstScene = () => {
    return (
        <Canvas
            style={{background: '#171720'}}
            shadowMap >
            <fog attach="fog" args={['#090b1f', 0, 10]} />
            <Suspense fallback={null}>
                <Environment/>
                <Cubes/>
                <Lights/>
                <Controls/>
            </Suspense>
        </Canvas>
    );
};

export default FirstScene;
