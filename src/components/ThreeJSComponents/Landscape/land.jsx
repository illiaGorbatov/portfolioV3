import React, {useCallback, useEffect, useRef} from 'react';
import * as THREE from 'three';
import {MainShader} from "./shaders/mainShader";
import {useFrame, useLoader} from "react-three-fiber";
import palette from '../textures/land/pallete.png';
import {getState, subscribe} from "../../../utils/zustandStore";

const Land = () => {

    const material = useRef();

    const landTexture = useLoader(THREE.TextureLoader, palette);

    const mouseCoords = useRef(getState().mouseCoords);
    const yDamped = useRef(0);
    const xDamped = useRef(0);
    useEffect(() => subscribe(scr => (mouseCoords.current = scr), state => state.mouseCoords));

    const map = useCallback((value, start1, stop1, start2, stop2) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
    }, []);
    const lerp = useCallback((start, end, amt) => {
        return (1 - amt) * start + amt * end;
    }, []);

    useFrame(() => {
        const time = performance.now()*0.001;
        yDamped.current = lerp(yDamped.current, mouseCoords.current[1], 0.1);
        xDamped.current = lerp(xDamped.current, mouseCoords.current[0], 0.1);
        material.current.uniforms.distortCenter.value = Math.sin(time) * 0.1;
        material.current.uniforms.maxHeight.value = map(yDamped.current, 0, window.innerHeight, 20, 5);
        material.current.uniforms.time.value = time;
        material.current.uniforms.roadWidth.value = map(xDamped.current, 0, window.innerWidth, 1, 4.5);
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