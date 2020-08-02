import * as THREE from 'three';
import React, {useMemo} from 'react';
import {useLoader} from 'react-three-fiber';


const ShapeFont = ({children, ...props}) => {
    const font = useLoader(THREE.FontLoader, "./Fonts/MADE Evolve Sans_Regular.json");

    const lineText = useMemo(() => {
        let shapes = font.generateShapes(children, 2);
        let geometry = new THREE.ShapeBufferGeometry(shapes);
        geometry.computeBoundingBox();
        let xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

        let matDark = new THREE.LineBasicMaterial({
            color: 0x006699,
            side: THREE.DoubleSide
        });


        let holeShapes = [];
        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i];
            if (shape.holes && shape.holes.length > 0) {
                for (let j = 0; j < shape.holes.length; j++) {
                    let hole = shape.holes[j];
                    holeShapes.push(hole);
                }
            }
        }
        shapes.push.apply(shapes, holeShapes);
        console.log(shapes)
        let lineText = new THREE.Object3D();

        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i];
            let points = shape.getPoints();
            let geometry = new THREE.BufferGeometry().setFromPoints(points);
            geometry.translate(xMid, 0, 0);
            let lineMesh = new THREE.Line(geometry, matDark);
            lineText.add(lineMesh);

        }

        return lineText
    }, [children, font]);

    return (
        <primitive object={lineText} />
    )
}

export default ShapeFont