import React, {Suspense} from 'react';
import {Canvas} from "react-three-fiber";
import * as THREE from 'three';
import Controls from "../controls/controls";
import Eggg from "../../models/Egg-thick";


const Explosion = () => {
    return (
        <Canvas
            style={{background: '#171720'}}
            camera={{
                fov: 65,
                far: 2000000,
                position: [0, 0, 7]
            }}
        >
            <Suspense fallback={null}>
                <Controls/>
                <Eggg/>
            </Suspense>
        </Canvas>
    )
};

export default Explosion