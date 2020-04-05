import React, {useMemo} from "react";
import * as THREE from 'three';
import textureImg from '../textures/floor.jpg'
import {RepeatWrapping} from "three";

export default () => {

    const texture = useMemo(() => new THREE.TextureLoader().load(textureImg), [textureImg]);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(20, 20);

    return (
        <mesh receiveShadow position={[0, -3, 0]} rotation-x={THREE.Math.degToRad(-90)}>
            <planeBufferGeometry attach="geometry" args={[200, 200]}/>
            <meshStandardMaterial attach="material" metalness={1} map={texture} bumpMap={texture}
                                  metalnessMap={texture} roughnessMap={texture} bumpScale={0.5}/>
        </mesh>
    );
};
