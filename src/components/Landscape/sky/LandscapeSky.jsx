import React, {useCallback, useRef} from 'react';
import * as THREE from 'three';
import {SkyShader} from "../shaders/SkyShader";

const theta = Math.PI * (-0.03);
const phi = 2 * Math.PI * (-.25);
const moonPosition = [400000 * Math.cos(phi), 400000 * Math.sin(phi) * Math.sin(theta), 400000 * Math.sin(phi) * Math.cos(theta)];

const LandscapeSky = () => {
    return (
        <>
            <mesh>
                <sphereBufferGeometry attach="geometry" args={[450000, 32, 15]}/>
                <shaderMaterial attach="material" args={[SkyShader]}
                                side={THREE.BackSide} uniforms-sunPosition-value={moonPosition}/>
            </mesh>
        </>
    )
};
export default LandscapeSky