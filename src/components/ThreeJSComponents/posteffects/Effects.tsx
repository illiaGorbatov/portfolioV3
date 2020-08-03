import { useMemo, useEffect } from 'react'
import { useLoader, useThree, useFrame } from 'react-three-fiber'
import {
    SMAAImageLoader,
    BloomEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
    GodRaysEffect,
    SMAAEffect, SMAAPreset,
    // @ts-ignore
} from 'postprocessing'


/*const Effects = () => {
    const { gl, scene, camera, size } = useThree()
    const smaa = useLoader(SMAAImageLoader)
    const composer = useMemo(() => {
        const composer = new EffectComposer(gl)
        composer.addPass(new RenderPass(scene, camera))
        const smaaEffect = new SMAAEffect(...smaa, SMAAPreset.MEDIUM)
        const bloom = new BloomEffect({
            luminanceThreshold: 0.2,
            luminanceSmoothing: 0,
            resolutionScale: 1
        })
        bloom.blendMode.opacity.value = 2
        composer.addPass(new EffectPass(camera))
        const effectPass = new EffectPass(camera, smaaEffect, bloom)
        effectPass.renderToScreen = true
        composer.addPass(effectPass)
        return composer
    }, [camera, gl, scene, smaa])
    useEffect(() => void composer.setSize(size.width, size.height), [composer, size])
    return useFrame((_, delta) => composer.render(delta), 1)
};*/
export const Bloom = () => {
    const { gl, scene, camera, size } = useThree()
    const composer = useMemo(() => {
        const composer = new EffectComposer(gl)
        composer.addPass(new RenderPass(scene, camera))
        const bloom = new BloomEffect({
            luminanceThreshold: 0.2,
            luminanceSmoothing: 0,
            resolutionScale: 1
        })
        bloom.blendMode.opacity.value = 2
        const effectPass = new EffectPass(camera, bloom)
        effectPass.renderToScreen = true
        composer.addPass(effectPass)
        console.log(composer)
        return composer
    }, [camera, gl, scene])
    useEffect(() => void composer.setSize(size.width, size.height), [composer, size])
    return useFrame((_, delta) => composer.render(delta), 1)
};

