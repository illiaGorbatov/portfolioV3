import * as THREE from 'three';
import React, {useMemo} from 'react';
import {useLoader} from 'react-three-fiber';


const BasicFont = ({children, ...props}) => {
    const font = useLoader(THREE.FontLoader, "./Fonts/MADE Evolve Sans EVO_Regular.json");

    const wordsGeometry = useMemo(() => {
        let shapes = font.generateShapes(children, 3);
        let geometry = new THREE.ShapeBufferGeometry(shapes);
        geometry.computeBoundingBox();
        let xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(xMid, 0, 0);
        return geometry
    }, [children, font]);
    return (
        <mesh geometry={wordsGeometry} {...props}>
            <meshBasicMaterial attach="material" color={'red'} transparent={true} opacity={0.6}
                               side={THREE.DoubleSide}/>
        </mesh>
    )
}

export default BasicFont