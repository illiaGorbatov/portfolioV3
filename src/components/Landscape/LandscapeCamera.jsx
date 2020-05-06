import React, {useEffect, useRef} from 'react';
import {useFrame, useThree} from "react-three-fiber";
import {useSpring, animated} from "react-spring/three";

const LandscapeCamera = (props) => {
    const ref = useRef();
    const {setDefaultCamera} = useThree();
    // Make the camera known to the system
    useEffect(() => void setDefaultCamera(ref.current), []);

    const {position} = useSpring({
        from: {position: [0, 30, 4]},
        to: {position: [0, 9, 4]},
        config: {
            mass: 0.5,
            tension: 100,
            friction: 100,
            clamp: true
        }
    });
    useFrame(() => {
       /* console.log(ref.current.position)*/
    })


    return <animated.perspectiveCamera ref={ref} {...props} position={position}/>
}

export default LandscapeCamera