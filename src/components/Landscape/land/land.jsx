import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {MainShader} from "../shaders/mainShader";
import {useFrame, useLoader} from "react-three-fiber";
import palette from '../../textures/land/pallete.png';

const Land = (props) => {
    const terrain = useRef();
    const landTexture = useLoader(THREE.TextureLoader, palette);

    const timeValue = useRef(0);
    const distortCenterValue = useRef(0);
    const maxHeightValue = useRef(0);

    const map = (value, start1, stop1, start2, stop2) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
    };
    const lerp = (start, end, amt) => {
        return (1 - amt) * start + amt * end;
    };

    const yDamped = useRef(0);

    useFrame(() => {
        const time = performance.now()*0.001;
        yDamped.current = lerp(yDamped.current, props.mouseY, 0.1);
        timeValue.current = time;
        distortCenterValue.current = Math.sin(time) * 0.1;
        maxHeightValue.current = map(yDamped.current, 0, window.innerHeight, 20, 5);
        /*console.log(maxHeightValue.current, distortCenterValue.current, timeValue.current);*/
    })

    return (
        <mesh position-z={-180} rotation-x={-Math.PI / 2} >
            <planeBufferGeometry attach="geometry" args={[100, 400, 400, 400]}/>
            <shaderMaterial attach="material" ref={terrain} args={[MainShader]} wireframe={false} needsUpdate={true}
            uniforms-pallete-value={landTexture} uniforms-time-value={timeValue.current} uniforms-distortCenter-value={distortCenterValue.current}
            uniforms-maxHeight-value={maxHeightValue.current}/>
        </mesh>
    )
};

export default Land