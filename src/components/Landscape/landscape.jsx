import React, {Suspense, useRef, useState} from 'react';
import {Canvas, useThree} from "react-three-fiber";
import Controls from "../controls/controls";
import * as THREE from 'three';
import Land from "./land/land";
import LandscapeSky from "./sky/LandscapeSky";

const theta = Math.PI * (-0.03);
const phi = 2 * Math.PI * (-.25);


const Landscape = () => {

    const [mouseY, setMouseY] = useState(0);
    const onMouseMoveHandler = (e) => {
        setMouseY(e.clientY);
    };

    return (
        <Canvas
            onMouseMove={onMouseMoveHandler}
            style={{background: 'black'}}
            shadowMap
            onCreated={({camera}) => {
                camera.lookAt(400000 * Math.cos(phi), 400000 * Math.sin(phi) * Math.sin(theta), 400000 * Math.sin(phi) * Math.cos(theta));
            }}
            camera={{
                fov: 65,
                far: 2000000,
                position: [0, 8, 4],
            }}>
            <fog attach="fog" args={['black', 0, 1000]}/>
            <ambientLight color={'white'} intensity={1}/>
            <Suspense fallback={null}>
                <Land  mouseY={mouseY}/>
                <LandscapeSky/>
            </Suspense>
        </Canvas>
    );
};

export default Landscape;
