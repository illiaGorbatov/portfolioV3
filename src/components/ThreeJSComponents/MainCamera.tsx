import React, {useEffect, useRef} from "react";
import {useFrame, useThree} from "react-three-fiber";
import {animated, useSpring} from "react-spring/three";
import {useStore} from "../../utils/zustandStore";

const MainCamera = () => {

    const cameraPosition = useStore(state => state.cameraPosition);
    const explosionPosition = useStore(state => state.explosionPosition);
    const scenes = useStore(state => state.scenes);

    const ref = useRef();
    const {setDefaultCamera, camera} = useThree();
    // Make the camera known to the system
    useEffect(() => void setDefaultCamera(ref.current!), []);

    const behavior = useRef('');
    const rotation = useRef(0);
    const setCameraBehavior = () => {
        if (scenes.currentScene === 'explosion' && scenes.previousScene === 'landscape') {
            behavior.current = 'radial';
        }
    };

    const {position} = useSpring({
        position: cameraPosition,
        config: {
            mass: 0.6,
            tension: 100,
            friction: 80,
        },
        onRest: () => setCameraBehavior()
    });
    useFrame(() => {
        if (explosionPosition) {
            if (behavior.current === 'radial') {
                rotation.current += 0.001;
                camera.position.x = explosionPosition[0] + Math.sin(rotation.current) * 10;
                camera.position.z = explosionPosition[2] + Math.cos(rotation.current) * 30;
            }
            camera.lookAt(...explosionPosition)
        }
    })

    // @ts-ignore
    return <animated.perspectiveCamera ref={ref} position={position}/>
}

export default MainCamera