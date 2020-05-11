import React, {useEffect, useRef} from 'react';
import {useFrame, useThree} from "react-three-fiber";
import {useSpring, animated} from "react-spring/three";
import {easeExpIn} from "d3-ease";

const ExplosionCamera = (props) => {
    const ref = useRef();
    const { setDefaultCamera, camera } = useThree();
    // Make the camera known to the system
    useEffect(() => void setDefaultCamera(ref.current), []);

    const {z} = useSpring({
        from: {z: 1000},
        z: 7,
        config: {
            mass: 0.6,
            tension: 100,
            friction: 50,
            clamp: true
        }
    });

    /*const [cameraMoving, setCamera] = useSpring({
        from: {z: 7},
    });

    const onclickHandler = () => {
        setCamera({
            to: async (next) => {
                await next({z: 0.5, config: {duration: 500, easing: easeExpIn}})
            }
        })
    }*/
    // Update it every frame
    const rotation = useRef(0);

    useFrame(() => {
        if (camera.position.z > 7) {
            camera.position.z = z.value
        } else {
            rotation.current += 0.001;
            camera.position.x = Math.sin(rotation.current) * 7;
            camera.position.z = Math.cos(rotation.current) * 7;
            camera.lookAt(0, 0, 0);
        }
    });

    return <animated.perspectiveCamera ref={ref} {...props} />
}

export default ExplosionCamera