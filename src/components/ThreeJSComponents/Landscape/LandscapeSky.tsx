import React, {useCallback, useEffect, useRef} from 'react';
import * as THREE from 'three';
import {SkyShader} from "./shaders/SkyShader";
import {useFrame} from "react-three-fiber";
import {getState, subscribe, useStore} from "../../../utils/zustandStore";
import {useSpring, animated} from "react-spring/three";

type PropsType ={
    changeRenderedScene: (scene: string) => void
}

const LandscapeSky: React.FC<PropsType> = ({changeRenderedScene}) => {

    const scrolled = useRef(getState().scrolled);
    const scenes = useStore(state => state.scenes);
    const setCameraPosition = useStore(state => state.setCameraPosition);
    const setExplosionPosition = useStore(state => state.setExplosionPosition);

    useEffect(() => subscribe(scr => scrolled.current = scr as number, state => state.scrolled));

    const material = useRef(new THREE.ShaderMaterial());

    const [{opacity}, setOpacity] = useSpring(() => ({opacity: 1}));
    useEffect(() => {
        if (scenes.currentScene === 'explosion' && scenes.previousScene === 'landscape') {
            const sunPosition: [number, number, number] = material.current.uniforms.sunPosition.value;
            const cameraPosition: [number, number, number] = [sunPosition[0], sunPosition[1]+10, sunPosition[2]+30];
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
        const sunPosition = [
            225000 * Math.cos(phi),
            2500 + 200000 * scrolled.current,
            225000 * Math.sin(phi) * Math.cos(theta)
        ];
        material.current.uniforms.turbidity.value = 13 - scrolled.current * 12;
        material.current.uniforms.rayleigh.value = 1.2 - scrolled.current * 1.19;
        material.current.uniforms.mieCoefficient.value = 0.1 - scrolled.current * 0.09997;
        material.current.uniforms.mieDirectionalG.value = 0.58 - 0.1 * scrolled.current;
        material.current.uniforms.sunPosition.value = sunPosition;
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
                <boxBufferGeometry attach="geometry" args={[450000, 450000, 450000]}/>
                <animated.shaderMaterial ref={material} attach="material" args={[SkyShader]} side={THREE.BackSide}
                                         uniforms-opacity-value={opacity} />
            </mesh>
        </>
    )
};
export default LandscapeSky