import React, {useEffect, useRef} from 'react';
import {useFrame, useThree} from "react-three-fiber";
import {useSpring} from "react-spring";

const Camera = (props) => {
    const ref = useRef();
    const { setDefaultCamera, camera } = useThree();
    // Make the camera known to the system
    useEffect(() => void setDefaultCamera(ref.current), []);

    const {z} = useSpring({
        from: {z: 1000},
        z: 15,
        config: {
            mass: 0.6,
            tension: 200,
            friction: 100,
            clamp: true
        }
    })
    // Update it every frame
    const rotation = useRef(0);

    useFrame(() => {
        /*if (camera.position.z > 15) {
            camera.position.z = z.value
        } else {
            rotation.current += 0.001;
            camera.position.x = Math.sin(rotation.current) * 15;
            camera.position.z = Math.cos(rotation.current) * 15;
            camera.lookAt(0, 0, 0);
        }*/
    });

    return <perspectiveCamera ref={ref} {...props} />
}

export default Camera