import React, {Suspense, useCallback, useState} from 'react';
import Land from "../Landscape/land";
import LandscapeSky from "../Landscape/LandscapeSky";
import Model from "../Explosion/Model";
import Stars from "../Explosion/stars";
import {useStore} from "../../utils/zustandStore";
import MainCamera from "./MainCamera";
import Trackball from "../controls/trackballControls";
import {useSpring, animated} from "react-spring/three";

const TransitionsBetweenScenes = () => {

    const scenes = useStore(state => state.scenes);
    const explosionPosition = useStore(state => state.explosionPosition);

    const [renderedScene, setRenderedScene] = useState('landscape');
    const changeRenderedScene = useCallback((scene) => {
        setRenderedScene(scene)
    }, []);

    const {landscapeOpacity, explosionOpacity} = useSpring({
        landscapeOpacity: scenes.currentScene === 'landscape' ? 1 : 0,
        explosionOpacity: scenes.currentScene === 'explosion' ? 1 : 0,
        roadOpacity: scenes.currentScene === 'road' ? 1 : 0,
        config: {
            clamp: true
        },
        onRest : () => {
            if (scenes.currentScene === 'landscape') setRenderedScene('landscape');
            if (scenes.currentScene === 'explosion') setRenderedScene('explosion');
            if (scenes.currentScene === 'road') setRenderedScene('road');
        }
    }, [scenes]);

    console.log(scenes, explosionPosition)

    return (
        <Suspense fallback={null}>
            {renderedScene === 'landscape' &&
            <animated.group opacity={landscapeOpacity}>
                <Land/>
                <LandscapeSky/>
            </animated.group>}
            {renderedScene === 'explosion' &&
            <animated.group opacity={explosionOpacity} position={explosionPosition}>
                <Model/>
                <Stars/>
            </animated.group>}
            <MainCamera/>
        </Suspense>
    )
}

export default TransitionsBetweenScenes;