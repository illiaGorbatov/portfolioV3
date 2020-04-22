import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils";

const ModelTestIco = () => {

    const ref = useRef();

    useEffect(() => {
        function getRandomAxis() {
            return new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize();
        }

        function getCentroid(geometry) {
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
            return { x: (3 * x) / len, y: (3 * y) / len, z: (3 * z) / len };
        }

        class explosion {
            constructor(selector, options, inverted) {
                this.scene = new THREE.Scene();

                this.inverted = inverted || false;

                this.onLoad = options.onLoad;
                this.onClick = options.onClick;

                this.surfaceColor = options.surface;
                this.insideColor = options.inside;
                this.backgroundColor = options.background;
                this.surfaceColor = new THREE.Color(parseInt("0x" + this.surfaceColor));
                this.insideColor = new THREE.Color(parseInt("0x" + this.insideColor));

                this.renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: this.backgroundColor === "transparent"
                });
                if (this.backgroundColor === "transparent") {
                    this.renderer.setClearColor(0x000000, 0);
                } else {
                    this.backgroundColor = parseInt("0x" + this.backgroundColor, 16);
                    this.renderer.setClearColor(this.backgroundColor, 1);
                }

                this.renderer.setPixelRatio(window.devicePixelRatio);

                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.renderer.setSize(this.width, this.height);
                ref.current.appendChild(this.renderer.domElement);
                console.log(ref.current)

                this.camera = new THREE.PerspectiveCamera(
                    70,
                    window.innerWidth / window.innerHeight,
                    0.001,
                    1000
                );

                this.camera.position.set(0, 0, 7);
                this.time = 0;
                this.loader = new GLTFLoader();
                this.dracoLoader = new DRACOLoader();
                this.dracoLoader.setDecoderPath('/draco-gltf/');
                this.loader.setDRACOLoader(this.dracoLoader);

                this.setupResize();

                this.setupcubeTexture();
                this.resize();
                this.addObjects();
                this.animate();
                this.load();
                this.settings();
            }

            settings() {
                this.settings = {
                    progress: 0

                };
            }

            load() {
                let that = this;
                this.voron = [];

                this.loader.load(
                    "ico-more.glb",
                    function(gltf) {
                        gltf.scene.traverse(function(child) {
                            if (child.name === "Voronoi_Fracture") {
                                that.obj = child;
                                if (child.children[0].children.length > 2) {
                                    child.children.forEach(f => {
                                        f.children.forEach(m => {
                                            that.voron.push(m.clone());
                                        });
                                    });
                                } else {
                                    child.children.forEach(m => {
                                        that.voron.push(m.clone());
                                    });
                                }
                            }
                        });

                        that.geoms = [];
                        that.geoms1 = [];
                        let j = 0;
                        that.voron = that.voron.filter(v => {
                            if (v.isMesh) return false;
                            else {
                                j++;
                                let vtempo = that.processSurface(v, j);

                                if (that.inverted) {
                                    that.geoms1.push(vtempo.surface);
                                    that.geoms.push(vtempo.volume);
                                } else {
                                    that.geoms.push(vtempo.surface);
                                    that.geoms1.push(vtempo.volume);
                                }

                                return true;
                            }
                        });

                        let s = BufferGeometryUtils.mergeBufferGeometries(
                            that.geoms,
                            false
                        );

                        that.mesh = new THREE.Mesh(s, that.material);
                        that.scene.add(that.mesh);

                        let s1 = BufferGeometryUtils.mergeBufferGeometries(
                            that.geoms1,
                            false
                        );
                        that.mesh1 = new THREE.Mesh(s1, that.material1);
                        that.scene.add(that.mesh1);
                    },
                    undefined,
                    function(e) {
                        console.error(e);
                    }
                );
            }

            processSurface(v, j) {
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

                return { surface: vtemp, volume: vtemp1 };
            }

            setupResize() {
                window.addEventListener("resize", this.resize.bind(this));
            }

            resize() {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.renderer.setSize(this.width, this.height);
                this.camera.aspect = this.width / this.height;
                this.camera.updateProjectionMatrix();
            }

            render() {
                this.renderer.render(this.scene, this.camera);
            }

            setupcubeTexture() {
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
                this.textureCube = new THREE.CubeTextureLoader().load(urls1);
                this.textureCube.minFilter = THREE.LinearFilter;
            }

            addObjects() {
                let that = this;
                this.material = new THREE.ShaderMaterial({
                    extensions: {
                        derivatives: "#extension GL_OES_standard_derivatives : enable"
                    },
                    side: THREE.DoubleSide,
                    uniforms: {
                        time: { type: "f", value: 0 },
                        progress: { type: "f", value: 0 },
                        inside: { type: "f", value: 0 },
                        surfaceColor: { type: "v3", value: this.surfaceColor },
                        insideColor: { type: "v3", value: this.insideColor },
                        tCube: { value: that.textureCube },
                        pixels: {
                            type: "v2",
                            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                        },
                        uvRate1: {
                            value: new THREE.Vector2(1, 1)
                        }
                    },
                    vertexShader: `uniform float time;
                    uniform float progress;
                    uniform float inside;



                    attribute vec3 centroid;
                    attribute vec3 axis;
                    attribute float offset;

                    varying vec3 eye;
                    varying vec3 vNormal;
                    varying vec3 vReflect;

                    mat4 rotationMatrix(vec3 axis, float angle) {
                    axis = normalize(axis);
                    float s = sin(angle);
                    float c = cos(angle);
                    float oc = 1.0 - c;

                    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                        oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                        oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                        0.0,                                0.0,                                0.0,                                1.0);
                }

                vec3 rotate(vec3 v, vec3 axis, float angle) {
                    mat4 m = rotationMatrix(axis, angle);
                    return (m * vec4(v, 1.0)).xyz;
                }

                vec3 bezier4(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
                    return mix(mix(mix(a, b, t), mix(b, c, t), t), mix(mix(b, c, t), mix(c, d, t), t), t);
                }

                float easeInOutQuint(float t){
                    return t < 0.5 ? 16.0 * t * t * t * t * t : 1.0 + 16.0 * (--t) * t * t * t * t;
                }
                float easeOutQuint(float t){
                    return 1. + (--t) * t * t * t * t;
                }
                float easeOut(float t){
                    return  t * t * t;
                }


                void main() {


                    vec3 newposition = position;

                    float vTemp =  1. - ((centroid.x + centroid.y)*0.5 + 1.)/2.;

                    float tProgress = max(0.0, (progress - vTemp*0.4) /0.6);
                    vec3 newnormal = rotate(normal,axis,tProgress*(3. + offset*10.));
                    vNormal = newnormal;

                    newposition += newposition + centroid*(tProgress)*(3. + offset*7.);

                    eye = normalize( vec3( modelViewMatrix * vec4( newposition, 1.0 ) ) );
                    vec4 worldPosition = modelMatrix * vec4( newposition, 1.0 );
                    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * newnormal );
                    vec3 I = worldPosition.xyz - cameraPosition;
                    vReflect = reflect( I, worldNormal );
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
                }`,
                    fragmentShader: `uniform float time;
uniform float progress;
uniform float inside;
uniform vec3 surfaceColor;
uniform vec3 insideColor;
uniform samplerCube tCube;

varying vec2 vUv;
varying vec2 vUv1;
varying vec3 eye;
varying vec3 vNormal;
varying vec3 vReflect;


void main()	{

	vec3 r = reflect( eye, vNormal );
	float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
	vec2 vN = r.xy / m + .5;
	vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );

	vec3 light = normalize(vec3(12.,10.,10.));
	vec3 light1 = normalize(vec3(-12.,-10.,-10.));
	float l = clamp(dot(light, vNormal),0.5,1.);
	l += clamp(dot(light1, vNormal),0.5,1.)/2.;
	// l /= 2.;
	
	if(inside>0.5){
		gl_FragColor = vec4(l,l,l,1.)*vec4(surfaceColor,1.);
	} else{
		gl_FragColor = reflectedColor*vec4(insideColor,1.);
	}

}`
                });

                this.material1 = this.material.clone();
                this.material1.uniforms.inside.value = 1;
            }

            animate() {
                this.time += 0.05;
                this.material.uniforms.progress.value = Math.abs(this.settings.progress);
                this.material1.uniforms.progress.value = Math.abs(this.settings.progress);
                requestAnimationFrame(this.animate.bind(this));
                this.render();
            }
        }

        let animation = new explosion(
            'container', // id of DOM el
            {
                surface: '666666',
                inside: '98e898',
                background: '151616',
            }
        );

        let targetMouseX = 0, mouseX = 0, ta = 0;
        const sign = function(n) { return n === 0 ? 1 : n/Math.abs(n); };
        document.addEventListener('mousemove',(e) => {
            targetMouseX = 2*(e.clientX - animation.width/2)/animation.width;
        });

        document.addEventListener('touchmove',(e) => {
            targetMouseX = ( e.touches[0].clientX / animation.width ) * 2 - 1;
        });

        function draw(){
            if(animation){
                mouseX += (targetMouseX - mouseX)*0.05;
                ta = Math.abs(mouseX);
                animation.settings.progress = ta;
                animation.scene.rotation.y = Math.PI/2 - ta*(2 - ta)*Math.PI * sign(mouseX);
                animation.scene.rotation.z = Math.PI/2 - ta*(2 - ta)*Math.PI * sign(mouseX);
            }
            window.requestAnimationFrame(draw);
        }
        draw()
    }, []);


    return (
        <div ref={ref}/>
    )
};

export default ModelTestIco