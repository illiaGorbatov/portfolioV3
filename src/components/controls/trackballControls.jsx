import React, { useRef } from 'react';
import { extend, useThree, useFrame } from 'react-three-fiber';
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";


extend ({TrackballControls});

 const Trackball = () => {
    const controlsRef = useRef();
    const { camera, gl } = useThree();

    useFrame(() => controlsRef.current && controlsRef.current.update());

    return (
        <trackballControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            panSpeed={10}
        />
    );
};

 export default Trackball
