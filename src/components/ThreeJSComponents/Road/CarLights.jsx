import React, {useEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {carLightsFragment, carLightsVertex} from "./Shaders";
import {LongRaceDistortion, turbulentDistortionStill} from "./Distortions";
import {useFrame} from "react-three-fiber";
import {getState, subscribe} from "../../../utils/zustandStore";


const random = base => {
    if (Array.isArray(base)) return Math.random() * (base[1] - base[0]) + base[0];
    return Math.random() * base;
};

const pickRandom = arr => {
    if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)];
    return arr;
};

const fogUniforms = {
    fogColor: {type: "c", value: new THREE.Color('black')},
    fogNear: {type: "f", value: 80},
    fogFar: {type: "f", value: 1000}
};

const lerp = (current, target, speed = 0.1, limit = 0.001) => {
    let change = (target - current) * speed;
    if (Math.abs(change) < limit) {
        change = target - current;
    }
    return change;
};

const options = {
    lightPairsPerRoadWay: 100,
    roadWidth: 20,
    lanesPerRoad: 3,
    carLightsRadius: [0.05, 0.14],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    speed: [-120, -160],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    length: 400,
    colors: [0xD856BF, 0x6750A2, 0xC247AC],
    fade: new THREE.Vector2(0, 0.6),
    distortion: turbulentDistortionStill
};


const CarLights = () => {

    const progress = useRef(getState().scrolled);
    useEffect(() => subscribe(scr => (progress.current = scr), state => state.scrolled));

    const materialRef = useRef();

    const geometry = useMemo(() => {
        const curve = new THREE.LineCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1)
        );
        let geometry = new THREE.TubeBufferGeometry(curve, 40, 1, 8, false);
        let instanced = new THREE.InstancedBufferGeometry().copy(geometry);
        instanced.maxInstancedCount = options.lightPairsPerRoadWay * 2;  //lightPairsPerRoadWay * 2

        let laneWidth = options.roadWidth / options.lanesPerRoad;//options.roadWidth / options.lanesPerRoad;

        let aOffset = [];
        let aMetrics = [];
        let aColor = [];

        let colors = options.colors.map(c => new THREE.Color(c));

        for (let i = 0; i < options.lightPairsPerRoadWay; i++) {//options.lightPairsPerRoadWay
            let radius = random(options.carLightsRadius);//options.carLightsRadius
            let length = random(options.carLightsLength);//options.carLightsLength
            let speed = random(options.speed);//movingAwaySpeed and movingCloserSpeed

            let carLane = i % 3;
            let laneX = carLane * laneWidth - options.roadWidth/*options.roadWidth*/ / 2 + laneWidth / 2;

            let carWidth = random(options.carWidthPercentage/*options.carWidthPercentage*/) * laneWidth;
            // Drunk Driving
            let carShiftX = random(options.carShiftX/*options.carShiftX*/) * laneWidth;
            // Both lights share same shiftX and lane;
            laneX += carShiftX;

            let offsetY = random(options.carFloorSeparation/*options.carFloorSeparation*/) + radius * 1.3;

            let offsetZ = -random(options.length/*options.length*/);

            aOffset.push(laneX - carWidth / 2);
            aOffset.push(offsetY);
            aOffset.push(offsetZ);

            aOffset.push(laneX + carWidth / 2);
            aOffset.push(offsetY);
            aOffset.push(offsetZ);

            aMetrics.push(radius);
            aMetrics.push(length);
            aMetrics.push(speed);

            aMetrics.push(radius);
            aMetrics.push(length);
            aMetrics.push(speed);

            let color = pickRandom(colors);
            aColor.push(color.r);
            aColor.push(color.g);
            aColor.push(color.b);

            aColor.push(color.r);
            aColor.push(color.g);
            aColor.push(color.b);
        }
        instanced.setAttribute(
            "aOffset",
            new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false)
        );
        instanced.setAttribute(
            "aMetrics",
            new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false)
        );
        instanced.setAttribute(
            "aColor",
            new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false)
        );
        return instanced
    }, [])

    const material = useMemo(() => {
        let material = new THREE.ShaderMaterial({
            fragmentShader: carLightsFragment,
            vertexShader: carLightsVertex,
            transparent: true,
            uniforms: Object.assign(
                {
                    uColor: new THREE.Uniform(new THREE.Color(options.colors)),
                    uTime: new THREE.Uniform(0),
                    uTravelLength: new THREE.Uniform(options.length/*options.length*/),
                    uFade: new THREE.Uniform(options.fade)
                },
                fogUniforms,
                options.distortion.uniforms/*options.distortion.uniforms*/
            )
        });
        material.onBeforeCompile = shader => {
            shader.vertexShader = shader.vertexShader.replace(
                "#include <getDistortion_vertex>",
                options.distortion.getDistortion/*options.distortion.getDistortion*/
            );
        };
        return material
    }, []);

    let speedUp = 0, timeOffset = 0, speedUpTarget = 0;

    useFrame(({clock, camera}, delta) => {
        let lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
        speedUp += lerp(
            speedUp,
            speedUpTarget,
            lerpPercentage,
            0.00001
        );
        timeOffset += speedUp * delta;

        let time = clock.elapsedTime + timeOffset;

        materialRef.current.uniforms.uTime.value = time

        let fovChange = lerp(camera.fov, 90 + 60 * progress.current , lerpPercentage);
        if (fovChange !== 0) {
            camera.fov += fovChange * delta * 6;
        }

        if (options.distortion.getJS) {
            const distortion = options.distortion.getJS(0.025, time);

            camera.lookAt(
                new THREE.Vector3(
                    camera.position.x + distortion.x,
                    camera.position.y + distortion.y,
                    camera.position.z + distortion.z
                )
            );
            camera.updateProjectionMatrix();
        }
    })

    return (
        <mesh frustumCulled={false}>
            <instancedBufferGeometry attach="geometry" {...geometry}/>
            <shaderMaterial ref={materialRef}
                attach="material"
                args={[material]}
            />
        </mesh>
    );
};

export default CarLights