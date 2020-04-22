import React, {useCallback, useRef, useState} from 'react';
import * as THREE from 'three';
import {MainShader} from "./shaders/mainShader";
import {useFrame, useLoader} from "react-three-fiber";
import palette from '../textures/land/pallete.png';

const Land = ({mouseY}) => {

    const material = useRef();

    const landTexture = useLoader(THREE.TextureLoader, palette);

    const yDamped = useRef(0)

    const map = useCallback((value, start1, stop1, start2, stop2) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
    }, []);
    const lerp = useCallback((start, end, amt) => {
        return (1 - amt) * start + amt * end;
    }, []);

    useFrame(() => {
        const time = performance.now()*0.001;
        yDamped.current = lerp(yDamped.current, mouseY, 0.1);
        material.current.uniforms.distortCenter.value = Math.sin(time) * 0.1;
        material.current.uniforms.maxHeight.value = map(yDamped.current, 0, window.innerHeight, 20, 5);
        material.current.uniforms.time.value = time;
    })

    return (
        <mesh position-z={-180} rotation-x={-Math.PI / 2} >
            <planeBufferGeometry attach="geometry" args={[100, 400, 400, 400]}/>
            <shaderMaterial attach="material" ref={material} args={[MainShader]} wireframe={false} needsUpdate={true}
            uniforms-pallete-value={landTexture} />
        </mesh>
    )
};

export default Land