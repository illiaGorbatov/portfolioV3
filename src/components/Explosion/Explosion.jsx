import React, {Suspense, useState} from 'react';
import * as THREE from 'three';
import {Canvas} from "react-three-fiber";
import Controls from "../controls/controls";
import Model from "./Model";
import Stars from "./stars";


const Explosion = () => {

    const [mouseClientX, setMouseY] = useState(0);
    const onMouseMoveHandler = (e) => {
        setMouseY(e.clientX);
    };

    return (
        <Canvas
            onMouseMove={onMouseMoveHandler}
            camera={{
                fov: 65,
                far: 2000000,
                position: [0, 0, 7]
            }}
            onCreated={({ gl }) => {
                gl.setClearColor(new THREE.Color('rgb(21, 22, 22)'))
            }}
        >
            <Suspense fallback={null}>
                <Controls/>
                <Model mouseClientX={mouseClientX}/>
            </Suspense>
            <Stars/>
        </Canvas>
    )
};

export default Explosion