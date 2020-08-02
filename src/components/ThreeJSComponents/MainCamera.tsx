import React, {useEffect, useRef} from "react";
import {useFrame, useThree} from "react-three-fiber";
import {animated, useSpring} from "react-spring/three";
import {useStore} from "../../utils/zustandStore";

const MainCamera = () => {

    const cameraPosition  = useStore(state => state.cameraPosition);
    const explosionPosition = useStore(state => state.explosionPosition);
    const scenes = useStore(state => state.scenes);

    const ref = useRef();
    const {setDefaultCamera, camera} = useThree();
    // Make the camera known to the system
    useEffect(() => void setDefaultCamera(ref.current!), []);

    const behavior = useRef('radial');
    const rotation = useRef(0);
    const setCameraBehavior = () => {
        if (scenes.currentScene === 'explosion' && scenes.previousScene === 'landscape') {
            behavior.current = 'radial';
        }
    };

    const {position} = useSpring({
        position: cameraPosition,
        config: {
            clamp: true
        },
        onRest: () => setCameraBehavior()
    });
    console.log(cameraPosition)
    useFrame(() => {
        if (behavior.current === 'radial') {
            rotation.current += 0.001;
            camera.position.x = explosionPosition[0] + Math.sin(rotation.current) * 20;
            camera.position.z = explosionPosition[2] + Math.cos(rotation.current) * 20;
            camera.lookAt(...explosionPosition);
        }
    })

    // @ts-ignore
    return <animated.perspectiveCamera ref={ref} position={position}/>
}

export default MainCamera