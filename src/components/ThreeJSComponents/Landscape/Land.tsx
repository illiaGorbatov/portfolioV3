import React, {useCallback, useEffect, useRef} from 'react';
import * as THREE from 'three';
import {MainShader} from "./shaders/mainShader";
import {useFrame, useLoader} from "react-three-fiber";
import palette from '../textures/land/pallete.png';
import {getState, subscribe} from "../../../utils/zustandStore";

const Land: React.FC= () => {

    const landTexture = useLoader(THREE.TextureLoader, palette);

    const mouseCoordinates = useRef(getState().mouseCoords);
    const yDamped = useRef(0);
    const xDamped = useRef(0);
    useEffect(() => subscribe(scr => mouseCoordinates.current = scr as number[], state => state.mouseCoords), []);

    const map = useCallback((value: number, start1: number, stop1: number, start2: number, stop2: number) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
    }, []);
    const lerp = useCallback((start: number, end: number, amt: number) => {
        return (1 - amt) * start + amt * end;
    }, []);

    const material = useRef(new THREE.ShaderMaterial());

    useFrame(() => {
        const time = performance.now()*0.001;
        yDamped.current = lerp(yDamped.current, mouseCoordinates.current[1], 0.1);
        xDamped.current = lerp(xDamped.current, mouseCoordinates.current[0], 0.1);
        material.current.uniforms.distortCenter.value = Math.sin(time) * 0.1;
        material.current.uniforms.maxHeight.value = map(yDamped.current, 0, window.innerHeight, 20, 5);
        material.current.uniforms.time.value = time;
        material.current.uniforms.roadWidth.value = map(xDamped.current, 0, window.innerWidth, 1, 4.5);
        /*console.log(material.current.uniforms)*/
    });

    return (
        <mesh position-z={-180} rotation-x={-Math.PI / 2} >
            <planeBufferGeometry attach="geometry" args={[100, 400, 400, 400]}/>
            <shaderMaterial attach="material" ref={material} args={[MainShader]} wireframe={false}
            uniforms-palette-value={landTexture} fog={true}/>
        </mesh>
    )
};

export default Land