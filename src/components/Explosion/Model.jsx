import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';

import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {shader} from "./shaderMaterial";
import {shader2} from "./shaderMaterial2";
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils";
import {useFrame} from "react-three-fiber";

const processSurface = (v, j) => {
    let c = v.position;
    let vtemp, vtemp1;
    vtemp = v.children[0].geometry.clone();
    vtemp = vtemp.applyMatrix4(
        new THREE.Matrix4().makeTranslation(c.x, c.y, c.z)
    );
    vtemp1 = v.children[1].geometry;
    vtemp1 = vtemp1
        .clone()
        .applyMatrix4(new THREE.Matrix4().makeTranslation(c.x, c.y, c.z));

    let len = v.children[0].geometry.attributes.position.array.length / 3;
    let len1 = v.children[1].geometry.attributes.position.array.length / 3;
    //  id
    let offset = new Array(len).fill(j / 100);
    vtemp.setAttribute(
        "offset",
        new THREE.BufferAttribute(new Float32Array(offset), 1)
    );

    let offset1 = new Array(len1).fill(j / 100);
    vtemp1.setAttribute(
        "offset",
        new THREE.BufferAttribute(new Float32Array(offset1), 1)
    );

    // axis
    let getRandomAxis = () => {
        return new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
    };

    let axis = getRandomAxis();
    let axes = new Array(len * 3).fill(0);
    let axes1 = new Array(len1 * 3).fill(0);
    for (let i = 0; i < len * 3; i = i + 3) {
        axes[i] = axis.x;
        axes[i + 1] = axis.y;
        axes[i + 2] = axis.z;
    }
    vtemp.setAttribute(
        "axis",
        new THREE.BufferAttribute(new Float32Array(axes), 3)
    );
    for (let i = 0; i < len1 * 3; i = i + 3) {
        axes1[i] = axis.x;
        axes1[i + 1] = axis.y;
        axes1[i + 2] = axis.z;
    }
    vtemp1.setAttribute(
        "axis",
        new THREE.BufferAttribute(new Float32Array(axes1), 3)
    );

    let getCentroid = geometry => {
        let ar = geometry.attributes.position.array;
        let len = ar.length;
        let x = 0,
            y = 0,
            z = 0;
        for (let i = 0; i < len; i = i + 3) {
            x += ar[i];
            y += ar[i + 1];
            z += ar[i + 2];
        }
        return {x: (3 * x) / len, y: (3 * y) / len, z: (3 * z) / len};
    }

    let centroidVector = getCentroid(vtemp);
    let centroid = new Array(len * 3).fill(0);
    let centroid1 = new Array(len1 * 3).fill(0);
    for (let i = 0; i < len * 3; i = i + 3) {
        centroid[i] = centroidVector.x;
        centroid[i + 1] = centroidVector.y;
        centroid[i + 2] = centroidVector.z;
    }
    for (let i = 0; i < len1 * 3; i = i + 3) {
        centroid1[i] = centroidVector.x;
        centroid1[i + 1] = centroidVector.y;
        centroid1[i + 2] = centroidVector.z;
    }
    vtemp.setAttribute(
        "centroid",
        new THREE.BufferAttribute(new Float32Array(centroid), 3)
    );
    vtemp1.setAttribute(
        "centroid",
        new THREE.BufferAttribute(new Float32Array(centroid1), 3)
    );

    return {surface: vtemp, volume: vtemp1};
};



const Model = ({mouseClientX}) => {

    const material = useRef();
    const material1 = useRef();

    const texturesSource = () => {
        let path = "img/newsky/";
        let format = ".jpg";
        let urls1 = [
            path + "px" + format,
            path + "nx" + format,
            path + "py" + format,
            path + "ny" + format,
            path + "pz" + format,
            path + "nz" + format
        ];
        return urls1
    };

    const texturesUrl = texturesSource();
    const textures = useMemo(() => new THREE.CubeTextureLoader().load(texturesUrl), [texturesUrl]);
    textures.minFilter = THREE.LinearFilter;

    const [{ss, ss1}, setS] = useState({ss: THREE.BufferGeometry, ss1: THREE.BufferGeometry});

    useEffect(() => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco-gltf/');
        loader.setDRACOLoader(dracoLoader);

        loader.load("ico-more.glb",
            function (gltf) {
                let voron = [];
                gltf.scene.traverse(function (child) {
                    if (child.name === "Voronoi_Fracture") {
                        if (child.children[0].children.length > 2) {
                            child.children.forEach(f => {
                                f.children.forEach(m => {
                                    voron.push(m.clone());
                                });
                            });
                        } else {
                            child.children.forEach(m => {
                                voron.push(m.clone());
                            });
                        }
                    }
                });

                let geoms = [];
                let geoms1 = [];
                let j = 0;
                voron = voron.filter(v => {
                    if (v.isMesh) return false;
                    else {
                        j++;
                        let vtempo = processSurface(v, j);
                        geoms.push(vtempo.surface);
                        geoms1.push(vtempo.volume);
                        return true;
                    }
                });

                let s = BufferGeometryUtils.mergeBufferGeometries(
                    geoms,
                    false
                );
                s.computeBoundingSphere()

                let s1 = BufferGeometryUtils.mergeBufferGeometries(
                    geoms1,
                    false
                );
                s1.computeBoundingSphere()
                setS({ss: s, ss1: s1});
            }
        );
    }, []);

    useFrame(() => {
        let targetMouseX = 2*(mouseClientX - window.innerWidth/2)/window.innerWidth;
        let progress = Math.abs(targetMouseX)
        material.current.uniforms.progress.value = progress;
        material1.current.uniforms.progress.value = progress;
    });


    return (
        <>
            <mesh>
                <bufferGeometry attach="geometry" {...ss}/>
                <shaderMaterial  ref={material} attach="material" args={[shader]} uniforms-tCube-value={textures} />
            </mesh>
            <mesh>
                <bufferGeometry attach="geometry" {...ss1}/>
                <shaderMaterial ref={material1} attach="material" args={[shader2]} uniforms-tCube-value={textures} />
            </mesh>
        </>
    )
};

export default Model