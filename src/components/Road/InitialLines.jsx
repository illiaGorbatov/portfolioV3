import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import * as POSTPROCESSING from 'postprocessing';
import {
    carLightsFragment,
    carLightsVertex,
    distortion_vertex,
    roadBaseFragment,
    roadMarkings_fragment,
    roadMarkings_vars, roadVertex, sideSticksFragment, sideSticksVertex
} from "./Shaders";
import {turbulentDistortion} from "./Distortions";
import {SMAAImageLoader} from "postprocessing";

const InitialLines = () => {

    const ref = useRef()

    useEffect(() => {
        class App {
            constructor(container, options = {}) {
                // Init ThreeJS Basics
                this.options = options;

                if (this.options.distortion == null) {
                    this.options.distortion = {
                        uniforms: distortion_uniforms,
                        getDistortion: distortion_vertex
                    };
                }
                this.container = container;
                this.renderer = new THREE.WebGLRenderer({
                    antialias: false
                });
                this.renderer.setSize(container.offsetWidth, container.offsetHeight, false);
                this.renderer.setPixelRatio(window.devicePixelRatio);
                this.composer = new POSTPROCESSING.EffectComposer(this.renderer);
                container.appendChild(this.renderer.domElement);

                this.camera = new THREE.PerspectiveCamera(
                    options.fov,
                    container.offsetWidth / container.offsetHeight,
                    0.1,
                    10000
                );
                this.camera.position.z = -5;
                this.camera.position.y = 8;
                this.camera.position.x = 0;
                // this.camera.rotateX(-0.4);
                this.scene = new THREE.Scene();

                let fog = new THREE.Fog(
                    options.colors.background,
                    options.length * 0.2,
                    options.length * 500
                );
                this.scene.fog = fog;
                this.fogUniforms = {
                    fogColor: {type: "c", value: fog.color},
                    fogNear: {type: "f", value: fog.near},
                    fogFar: {type: "f", value: fog.far}
                };
                this.clock = new THREE.Clock();
                this.assets = new Map();
                this.disposed = false;
                // Create Objects
                this.road = new Road(this, options);
                this.leftCarLights = new CarLights(
                    this,
                    options,
                    options.colors.leftCars,
                    options.movingAwaySpeed,
                    new THREE.Vector2(0, 1 - options.carLightsFade)
                );
                this.rightCarLights = new CarLights(
                    this,
                    options,
                    options.colors.rightCars,
                    options.movingCloserSpeed,
                    new THREE.Vector2(1, 0 + options.carLightsFade)
                );
                this.leftSticks = new LightsSticks(this, options);

                this.fovTarget = options.fov;

                this.speedUpTarget = 0;
                this.speedUp = 0;
                this.timeOffset = 0;

                // Binds
                this.tick = this.tick.bind(this);
                this.init = this.init.bind(this);
                this.setSize = this.setSize.bind(this);
                this.onMouseDown = this.onMouseDown.bind(this);
                this.onMouseUp = this.onMouseUp.bind(this);
            }

            initPasses() {
                this.renderPass = new POSTPROCESSING.RenderPass(this.scene, this.camera);
                this.bloomPass = new POSTPROCESSING.EffectPass(
                    this.camera,
                    new POSTPROCESSING.BloomEffect({
                        luminanceThreshold: 0.2,
                        luminanceSmoothing: 0,
                        resolutionScale: 1
                    })
                );
                const smaaPass = new POSTPROCESSING.EffectPass(
                    this.camera,
                    new POSTPROCESSING.SMAAEffect(
                        this.assets.get("smaa-search"),
                        this.assets.get("smaa-area"),
                        POSTPROCESSING.SMAAPreset.MEDIUM
                    )
                );
                this.renderPass.renderToScreen = false;
                this.bloomPass.renderToScreen = false;
                smaaPass.renderToScreen = true;
                this.composer.addPass(this.renderPass);
                this.composer.addPass(this.bloomPass);
                this.composer.addPass(smaaPass);
            }

            loadAssets() {
                const assets = this.assets;
                const manager = new THREE.LoadingManager();
                const smaaImageLoader = new SMAAImageLoader(manager);
                return new Promise((resolve, reject) => {

                    manager.onLoad = () => resolve(assets);
                    manager.onError = reject;

                    smaaImageLoader.load(([search, area]) => {

                        assets.set("smaa-search", search);
                        assets.set("smaa-area", area);

                    });


                    /*const searchImage = new Image();
                    const areaImage = new Image();
                    assets.smaa = {};
                    searchImage.addEventListener("load", function () {
                        assets.smaa.search = this;
                        manager.itemEnd("smaa-search");
                    });

                    areaImage.addEventListener("load", function () {
                        assets.smaa.area = this;
                        manager.itemEnd("smaa-area");
                    });
                    manager.itemStart("smaa-search");
                    manager.itemStart("smaa-area");

                    searchImage.src = POSTPROCESSING.SMAAEffect.searchImageDataURL;
                    areaImage.src = POSTPROCESSING.SMAAEffect.areaImageDataURL;*/


                });
            }

            init() {
                this.initPasses();
                const options = this.options;
                this.road.init();
                this.leftCarLights.init();

                this.leftCarLights.mesh.position.setX(
                    -options.roadWidth / 2 - options.islandWidth / 2
                );
                this.rightCarLights.init();
                this.rightCarLights.mesh.position.setX(
                    options.roadWidth / 2 + options.islandWidth / 2
                );
                this.leftSticks.init();
                this.leftSticks.mesh.position.setX(
                    -(options.roadWidth + options.islandWidth / 2)
                );

                this.container.addEventListener("mousedown", this.onMouseDown);
                this.container.addEventListener("mouseup", this.onMouseUp);
                this.container.addEventListener("mouseout", this.onMouseUp);

                this.tick()
            }

            onMouseDown(ev) {
                if (this.options.onSpeedUp) this.options.onSpeedUp(ev);
                this.fovTarget = this.options.fovSpeedUp;
                this.speedUpTarget = this.options.speedUp;
            }

            onMouseUp(ev) {
                if (this.options.onSlowDown) this.options.onSlowDown(ev);
                this.fovTarget = this.options.fov;
                this.speedUpTarget = 0;
                // this.speedupLerp = 0.1;
            }

            update(delta) {
                let lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
                this.speedUp += lerp(
                    this.speedUp,
                    this.speedUpTarget,
                    lerpPercentage,
                    0.00001
                );
                this.timeOffset += this.speedUp * delta;

                let time = this.clock.elapsedTime + this.timeOffset;

                this.rightCarLights.update(time);
                this.leftCarLights.update(time);
                this.leftSticks.update(time);
                this.road.update(time);

                let updateCamera = false;
                let fovChange = lerp(this.camera.fov, this.fovTarget, lerpPercentage);
                if (fovChange !== 0) {
                    this.camera.fov += fovChange * delta * 6;
                    updateCamera = true;
                }

                if (this.options.distortion.getJS) {
                    const distortion = this.options.distortion.getJS(0.025, time);

                    this.camera.lookAt(
                        new THREE.Vector3(
                            this.camera.position.x + distortion.x,
                            this.camera.position.y + distortion.y,
                            this.camera.position.z + distortion.z
                        )
                    );
                    updateCamera = true;
                }
                if (updateCamera) {
                    this.camera.updateProjectionMatrix();
                }
            }

            render(delta) {
                this.composer.render(delta);
            }

            dispose() {
                this.disposed = true;
            }

            setSize(width, height, updateStyles) {
                this.composer.setSize(width, height, updateStyles);
            }

            tick() {
                if (this.disposed || !this) return;
                if (resizeRendererToDisplaySize(this.renderer, this.setSize)) {
                    const canvas = this.renderer.domElement;
                    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
                    this.camera.updateProjectionMatrix();
                }
                const delta = this.clock.getDelta();
                this.render(delta);
                this.update(delta);
                window.requestAnimationFrame(this.tick);
            }
        }

        const distortion_uniforms = {
            uDistortionX: new THREE.Uniform(new THREE.Vector2(80, 3)),
            uDistortionY: new THREE.Uniform(new THREE.Vector2(-40, 2.5))
        };

        const random = base => {
            if (Array.isArray(base)) return Math.random() * (base[1] - base[0]) + base[0];
            return Math.random() * base;
        };
        const pickRandom = arr => {
            if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)];
            return arr;
        };

        function lerp(current, target, speed = 0.1, limit = 0.001) {
            let change = (target - current) * speed;
            if (Math.abs(change) < limit) {
                change = target - current;
            }
            return change;
        }

        class CarLights {
            constructor(webgl, options, colors, speed, fade) {
                this.webgl = webgl;
                this.options = options;
                this.colors = colors;
                this.speed = speed;
                this.fade = fade;
            }

            init() {
                const options = this.options;
                // Curve with length 1
                let curve = new THREE.LineCurve3(
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, 0, -1)
                );
                // Tube with radius = 1
                let geometry = new THREE.TubeBufferGeometry(curve, 40, 1, 8, false);

                let instanced = new THREE.InstancedBufferGeometry().copy(geometry);
                instanced.maxInstancedCount = options.lightPairsPerRoadWay * 2;

                let laneWidth = options.roadWidth / options.lanesPerRoad;

                let aOffset = [];
                let aMetrics = [];
                let aColor = [];

                let colors = this.colors;
                if (Array.isArray(colors)) {
                    colors = colors.map(c => new THREE.Color(c));
                } else {
                    colors = new THREE.Color(colors);
                }

                for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
                    let radius = random(options.carLightsRadius);
                    let length = random(options.carLightsLength);
                    let speed = random(this.speed);

                    let carLane = i % 3;
                    let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;

                    let carWidth = random(options.carWidthPercentage) * laneWidth;
                    // Drunk Driving
                    let carShiftX = random(options.carShiftX) * laneWidth;
                    // Both lights share same shiftX and lane;
                    laneX += carShiftX;

                    let offsetY = random(options.carFloorSeparation) + radius * 1.3;

                    let offsetZ = -random(options.length);

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

                let material = new THREE.ShaderMaterial({
                    fragmentShader: carLightsFragment,
                    vertexShader: carLightsVertex,
                    transparent: true,
                    uniforms: Object.assign(
                        {
                            // uColor: new THREE.Uniform(new THREE.Color(this.color)),
                            uTime: new THREE.Uniform(0),
                            uTravelLength: new THREE.Uniform(options.length),
                            uFade: new THREE.Uniform(this.fade)
                        },
                        this.webgl.fogUniforms,
                        options.distortion.uniforms
                    )
                });
                material.onBeforeCompile = shader => {
                    shader.vertexShader = shader.vertexShader.replace(
                        "#include <getDistortion_vertex>",
                        options.distortion.getDistortion
                    );
                };

                let mesh = new THREE.Mesh(instanced, material);
                mesh.frustumCulled = false;
                this.webgl.scene.add(mesh);
                this.mesh = mesh;
            }

            update(time) {
                this.mesh.material.uniforms.uTime.value = time;
            }
        }

        class LightsSticks {
            constructor(webgl, options) {
                this.webgl = webgl;
                this.options = options;
            }

            init() {
                const options = this.options;
                const geometry = new THREE.PlaneBufferGeometry(1, 1);
                let instanced = new THREE.InstancedBufferGeometry().copy(geometry);
                let totalSticks = options.totalSideLightSticks;
                instanced.maxInstancedCount = totalSticks;

                let stickoffset = options.length / (totalSticks - 1);
                const aOffset = [];
                const aColor = [];
                const aMetrics = [];

                let colors = options.colors.sticks;
                if (Array.isArray(colors)) {
                    colors = colors.map(c => new THREE.Color(c));
                } else {
                    colors = new THREE.Color(colors);
                }

                for (let i = 0; i < totalSticks; i++) {
                    let width = random(options.lightStickWidth);
                    let height = random(options.lightStickHeight);
                    aOffset.push((i - 1) * stickoffset * 2 + stickoffset * Math.random());

                    let color = pickRandom(colors);
                    aColor.push(color.r);
                    aColor.push(color.g);
                    aColor.push(color.b);

                    aMetrics.push(width);
                    aMetrics.push(height);
                }
                instanced.setAttribute(
                    "aOffset",
                    new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1, false)
                );
                instanced.setAttribute(
                    "aColor",
                    new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false)
                );
                instanced.setAttribute(
                    "aMetrics",
                    new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false)
                );
                const material = new THREE.ShaderMaterial({
                    fragmentShader: sideSticksFragment,
                    vertexShader: sideSticksVertex,
                    // This ones actually need double side
                    side: THREE.DoubleSide,
                    uniforms: Object.assign(
                        {
                            uTravelLength: new THREE.Uniform(options.length),
                            uTime: new THREE.Uniform(0)
                        },
                        this.webgl.fogUniforms,
                        options.distortion.uniforms
                    )
                });

                material.onBeforeCompile = shader => {
                    shader.vertexShader = shader.vertexShader.replace(
                        "#include <getDistortion_vertex>",
                        options.distortion.getDistortion
                    );
                };

                const mesh = new THREE.Mesh(instanced, material);
                // The object is behind the camera before the vertex shader
                mesh.frustumCulled = false;
                // mesh.position.y = options.lightStickHeight / 2;
                this.webgl.scene.add(mesh);
                this.mesh = mesh;
            }

            update(time) {
                this.mesh.material.uniforms.uTime.value = time;
            }
        }

        class Road {
            constructor(webgl, options) {
                this.webgl = webgl;
                this.options = options;

                this.uTime = new THREE.Uniform(0);
            }

            createIsland() {
                const options = this.options;
                let segments = 100;
            }

            // Side  = 0 center, = 1 right = -1 left
            createPlane(side, width, isRoad) {
                const options = this.options;
                let segments = 100;
                const geometry = new THREE.PlaneBufferGeometry(
                    isRoad ? options.roadWidth : options.islandWidth,
                    options.length,
                    20,
                    segments
                );
                let uniforms = {
                    uTravelLength: new THREE.Uniform(options.length),
                    uColor: new THREE.Uniform(
                        new THREE.Color(
                            isRoad ? options.colors.roadColor : options.colors.islandColor
                        )
                    ),
                    uTime: this.uTime
                };
                if (isRoad) {
                    uniforms = Object.assign(uniforms, {
                        uLanes: new THREE.Uniform(options.lanesPerRoad),
                        uBrokenLinesColor: new THREE.Uniform(
                            new THREE.Color(options.colors.brokenLines)
                        ),
                        uShoulderLinesColor: new THREE.Uniform(
                            new THREE.Color(options.colors.shoulderLines)
                        ),
                        uShoulderLinesWidthPercentage: new THREE.Uniform(
                            options.shoulderLinesWidthPercentage
                        ),
                        uBrokenLinesLengthPercentage: new THREE.Uniform(
                            options.brokenLinesLengthPercentage
                        ),
                        uBrokenLinesWidthPercentage: new THREE.Uniform(
                            options.brokenLinesWidthPercentage
                        )
                    });
                }
                const material = new THREE.ShaderMaterial({
                    fragmentShader: isRoad ? roadFragment : islandFragment,
                    vertexShader: roadVertex,
                    side: THREE.DoubleSide,
                    uniforms: Object.assign(
                        uniforms,
                        this.webgl.fogUniforms,
                        options.distortion.uniforms
                    )
                });

                material.onBeforeCompile = shader => {
                    shader.vertexShader = shader.vertexShader.replace(
                        "#include <getDistortion_vertex>",
                        options.distortion.getDistortion
                    );
                };
                const mesh = new THREE.Mesh(geometry, material);
                mesh.rotation.x = -Math.PI / 2;
                // Push it half further away
                mesh.position.z = -options.length / 2;
                mesh.position.x +=
                    (this.options.islandWidth / 2 + options.roadWidth / 2) * side;
                this.webgl.scene.add(mesh);

                return mesh;
            }

            init() {
                this.leftRoadWay = this.createPlane(-1, this.options.roadWidth, true);
                this.rightRoadWay = this.createPlane(1, this.options.roadWidth, true);
                this.island = this.createPlane(0, this.options.islandWidth, false);
            }

            update(time) {
                this.uTime.value = time;
            }
        }

        const islandFragment = roadBaseFragment
            .replace("#include <roadMarkings_fragment>", "")
            .replace("#include <roadMarkings_vars>", "");


        const roadFragment = roadBaseFragment
            .replace("#include <roadMarkings_fragment>", roadMarkings_fragment)
            .replace("#include <roadMarkings_vars>", roadMarkings_vars);

        function resizeRendererToDisplaySize(renderer, setSize) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                setSize(width, height, false);
            }
            return needResize;
        };

        //OPTIONS AND SETUP

        (function() {

            const container = ref.current;

            const options = {
                onSpeedUp: (ev) => {
                },
                onSlowDown: (ev) => {
                },
                // mountainDistortion || LongRaceDistortion || xyDistortion || turbulentDistortion || turbulentDistortionStill || deepDistortionStill || deepDistortion
                distortion: turbulentDistortion,

                length: 400,
                roadWidth: 10,
                islandWidth: 2,
                lanesPerRoad: 3,

                fov: 90,
                fovSpeedUp: 150,
                speedUp: 2,
                carLightsFade: 0.4,

                totalSideLightSticks: 20,
                lightPairsPerRoadWay: 40,

                // Percentage of the lane's width
                shoulderLinesWidthPercentage: 0.05,
                brokenLinesWidthPercentage: 0.1,
                brokenLinesLengthPercentage: 0.5,

                /*** These ones have to be arrays of [min,max].  ***/
                lightStickWidth: [0.12, 0.5],
                lightStickHeight: [1.3, 1.7],

                movingAwaySpeed: [60, 80],
                movingCloserSpeed: [-120, -160],

                /****  Anything below can be either a number or an array of [min,max] ****/

                // Length of the lights. Best to be less than total length
                carLightsLength: [400 * 0.03, 400 * 0.2],
                // Radius of the tubes
                carLightsRadius: [0.05, 0.14],
                // Width is percentage of a lane. Numbers from 0 to 1
                carWidthPercentage: [0.3, 0.5],
                // How drunk the driver is.
                // carWidthPercentage's max + carShiftX's max -> Cannot go over 1.
                // Or cars start going into other lanes
                carShiftX: [-0.8, 0.8],
                // Self Explanatory
                carFloorSeparation: [0, 5],

                colors: {
                    roadColor: 0x080808,
                    islandColor: 0x0a0a0a,
                    background: 0x000000,
                    shoulderLines: 0x131318,
                    brokenLines: 0x131318,
                    /***  Only these colors can be an array ***/
                    leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
                    rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
                    sticks: 0x03B3C3,
                }
            };

            const myApp = new App(container, options);
            myApp.loadAssets().then(myApp.init)
        })()
    }, [])

    return (
        <div style={{height: '100vh'}} ref={ref}/>
    )
};

export default InitialLines