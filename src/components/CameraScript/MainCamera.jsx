import React, {useEffect, useRef} from "react";
import {useFrame, useThree} from "react-three-fiber";
import {animated, useSpring} from "react-spring/three";
import {useStore} from "../../utils/zustandStore";

const MainCamera = () => {

    const cameraPosition  = useStore(state => state.cameraPosition);

    const ref = useRef();
    const {setDefaultCamera} = useThree();
    // Make the camera known to the system
    useEffect(() => void setDefaultCamera(ref.current), []);

    const {position} = useSpring({
        position: cameraPosition === null ? ref.current.position : cameraPosition,
        config: {
            clamp: true
        }
    });

    useFrame(() => {
    })
console.log(cameraPosition)

    return <animated.perspectiveCamera ref={ref} position={position}/>
}

export default MainCamera