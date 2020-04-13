import React, {useCallback, useRef, useState} from 'react';
import * as THREE from 'three';
import {MainShader} from "../shaders/mainShader";
import {useFrame, useLoader} from "react-three-fiber";
import palette from '../../textures/land/pallete.png';

const Land = (props) => {
    const terrain = useRef();
    const landTexture = useLoader(THREE.TextureLoader, palette);

    const [{yDamped, timeValue, distortCenterValue, maxHeightValue}, setState] = useState({
        yDamped: 0, timeValue: 0, distortCenterValue: 0.1, maxHeightValue: 10.0
    });

    const map = useCallback((value, start1, stop1, start2, stop2) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
    }, []);
    const lerp = useCallback((start, end, amt) => {
        return (1 - amt) * start + amt * end;
    }, []);

    useFrame(() => {
        const time = performance.now()*0.001;
        const yDampedNext = lerp(yDamped, props.mouseY, 0.1);
        const distortCenterValueCurrent = Math.sin(time) * 0.1;
        const maxHeightValueCurrent = map(yDamped, 0, window.innerHeight, 20, 5);
        setState({yDamped: yDampedNext, timeValue: time, distortCenterValue: distortCenterValueCurrent, maxHeightValue: maxHeightValueCurrent})
    })

    return (
        <mesh position-z={-180} rotation-x={-Math.PI / 2} >
            <planeBufferGeometry attach="geometry" args={[100, 400, 400, 400]}/>
            <shaderMaterial attach="material" ref={terrain} args={[MainShader]} wireframe={false} needsUpdate={true}
            uniforms-pallete-value={landTexture} uniforms-time-value={timeValue} uniforms-distortCenter-value={distortCenterValue}
            uniforms-maxHeight-value={maxHeightValue}/>
        </mesh>
    )
};

export default Land