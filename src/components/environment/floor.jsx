import React, {useMemo} from "react";
import * as THREE from 'three';
import textureBump from '../textures/floor/floor-bump.jpg';
import textureRoughness from '../textures/floor/floor-roughtness.jpg';
import {RepeatWrapping} from "three";
import {useLoader} from "react-three-fiber";

export default () => {

    const [bumpTexture, roughnessTexture] = useLoader(THREE.TextureLoader,
        [textureBump, textureRoughness]);

    bumpTexture.wrapS = RepeatWrapping;
    bumpTexture.wrapT = RepeatWrapping;
    bumpTexture.repeat.set(20, 20);

    roughnessTexture.wrapS = RepeatWrapping;
    roughnessTexture.wrapT = RepeatWrapping;
    roughnessTexture.repeat.set(20, 20);

    return (
        <mesh receiveShadow position={[0, -3, 0]} rotation-x={THREE.Math.degToRad(-90)}>
            <planeBufferGeometry attach="geometry" args={[100, 100]}/>
            <meshStandardMaterial attach="material" bumpMap={bumpTexture}
                                  metalness={1} roughnessMap={roughnessTexture} bumpScale={0.5}/>
        </mesh>
    );
};
