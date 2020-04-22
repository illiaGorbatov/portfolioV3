import React, {Suspense} from 'react';
import {Canvas} from "react-three-fiber";
import * as THREE from 'three';
import CarLights from "./CarLights";
import Effects from "./Effects";

const theta = Math.PI * (-0.03);
const phi = 2 * Math.PI * (-.25);

const Road = () => {
/*console.log(400000 * Math.cos(phi), 400000 * Math.sin(phi) * Math.sin(theta), 400000 * Math.sin(phi) * Math.cos(theta))*/
    return (
        <Canvas
            onCreated={({gl, camera}) => {
                gl.setClearColor(new THREE.Color('rgb(21, 22, 22)'));
                camera.lookAt(400000 * Math.cos(phi), 400000 * Math.sin(phi) * Math.sin(theta), 400000 * Math.sin(phi) * Math.cos(theta));
            }}
            camera={{
                fov: 90,
                far: 10000,
                position: [0, 8, -5]
            }}>
            <fog attach="fog" args={['black', 80, 10000]}/>
            <CarLights />
            <Suspense fallback={null}>
                <Effects/>
            </Suspense>
        </Canvas>
    );
};

export default Road