import React, {useCallback, useEffect, useRef} from 'react';
import * as THREE from 'three';
import {SkyShader} from "./shaders/SkyShader";
import {useFrame} from "react-three-fiber";
import {getState, subscribe, useStore} from "../../utils/zustandStore";
import {useSpring, animated} from "react-spring/three";

const LandscapeSky = ({changeRenderedScene}) => {

    const scrolled = useRef(getState().scrolled);
    const scenes = useStore(state => state.scenes);
    const setCameraPosition = useStore(state => state.setCameraPosition);
    const setExplosionPosition = useStore(state => state.setExplosionPosition);

    useEffect(() => subscribe(scr => (scrolled.current = scr), state => state.scrolled));

    const material = useRef();

    const [{opacity}, setOpacity] = useSpring(() => ({opacity: 1}));
    useEffect(() => {
        if (scenes.currentScene === 'explosion' && scenes.previousScene === 'landscape') {
            const sunPosition = material.current.uniforms.sunPosition.value;
            const cameraPosition = [sunPosition[0], sunPosition[1], sunPosition[2] + 30];
            console.log(sunPosition, cameraPosition)
            setExplosionPosition(sunPosition)
            setCameraPosition(cameraPosition);
            setOpacity({opacity: 0, onRest: () => changeRenderedScene('explosion')});
            changeRenderedScene('landscape & explosion');
        }
    }, [scenes])

    const render = useCallback(() => {
        const theta = Math.PI * (-0.002 - 0.048 * scrolled.current);
        const phi = 2 * Math.PI * (-.25);
        const moonPosition = [
            400000 * Math.cos(phi),
            2500 + 200000 * scrolled.current,
            400000 * Math.sin(phi) * Math.cos(theta)
        ];
        material.current.uniforms.turbidity.value = 13 - scrolled.current * 12;
        material.current.uniforms.rayleigh.value = 1.2 - scrolled.current * 1.19;
        material.current.uniforms.mieCoefficient.value = 0.1 - scrolled.current * 0.09997;
        material.current.uniforms.mieDirectionalG.value = 0.9 - 0.1 * scrolled.current;
        material.current.uniforms.sunPosition.value = moonPosition;
    }, []);

    useEffect(() => {
        render()
    }, []);

    useFrame(() => {
        render();
    });

    return (
        <>
            <mesh>
                <sphereBufferGeometry attach="geometry" args={[450000, 32, 15]}/>
                <animated.shaderMaterial ref={material} attach="material" args={[SkyShader]} side={THREE.BackSide}
                                         uniforms-opacity-value={opacity} transparent={true}/>
            </mesh>
        </>
    )
};
export default LandscapeSky