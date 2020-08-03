import React, {useEffect, useLayoutEffect, useMemo, useRef} from 'react';
import {
    EffectComposer,
    EffectPass,
    RenderPass,
    GodRaysEffect,
    SMAAEffect,
    KernelSize,
    BloomEffect
    // @ts-ignore
} from 'postprocessing'
import {useFrame, useThree} from "react-three-fiber";
import * as THREE from 'three';

const NewSun: React.FC = () => {

    const sun = useRef(new THREE.Mesh());

    const {gl, scene, camera, size} = useThree()
    const composer = useMemo(() => {
        const composer = new EffectComposer(gl);
        composer.addPass(new RenderPass(scene, camera));
        console.log('render')
        return composer;
    }, [camera, gl, scene]);

    useLayoutEffect(() => {
        const godRays = new GodRaysEffect(
            camera, sun.current, {
                height: 480,
                kernelSize: KernelSize.SMALL,
                density: 0.96,
                decay: 0.92,
                weight: 0.3,
                exposure: 0.54,
                samples: 60,
            });
        let areaImage = new Image();
        areaImage.src = SMAAEffect.areaImageDataURL;
        let searchImage = new Image();
        searchImage.src = SMAAEffect.searchImageDataURL;
        let smaaEffect = new SMAAEffect(searchImage,areaImage,1);
        const effectPass = new EffectPass(camera, smaaEffect, godRays);
        effectPass.renderToScreen = true;
        composer.addPass(effectPass);
    }, [camera, gl, scene])

    useEffect(() => void composer.setSize(size.width, size.height), [composer, size]);

    useFrame((_, delta) => composer.render(delta), 1)

    return (
        <group position={[0, 0, -40]}>
            <pointLight args={[0xffccaa, 3, 20]}/>
            <mesh ref={sun}>
                <meshBasicMaterial attach='material' color={0xffccaa} transparent={true}/>
                <sphereBufferGeometry attach='geometry' args={[5, 32, 32]}/>
            </mesh>
        </group>
    )
}

export default NewSun