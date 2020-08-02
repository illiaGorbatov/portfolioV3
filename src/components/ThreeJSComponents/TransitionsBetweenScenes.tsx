import React, {Suspense, useCallback, useState} from 'react';
import Land from "./Landscape/land";
import LandscapeSky from "./Landscape/LandscapeSky";
import Model from "./Explosion/Model";
import Stars from "./stars";
import {useStore} from "../../utils/zustandStore";
import MainCamera from "./MainCamera";
import Trackball from "../controls/trackballControls";
import {useSpring, animated} from "react-spring/three";
import Mod from "./Explosion/mod";

const TransitionsBetweenScenes = () => {

    const scenes = useStore(state => state.scenes);
    const explosionPosition = useStore(state => state.explosionPosition);

    const [renderedScene, setRenderedScene] = useState('landscape');
    const changeRenderedScene = useCallback((scene) => {
        setRenderedScene(scene)
    }, []);

console.log(explosionPosition)
    return (
        <Suspense fallback={null}>
          {/*  {(renderedScene === 'landscape' || renderedScene === 'landscape & explosion') &&
            <group>
                <Land/>
                <LandscapeSky changeRenderedScene={changeRenderedScene}/>
            </group>}
            {(renderedScene === 'explosion' || renderedScene === 'landscape & explosion') &&*/}
            <group position={[0, 0, -10]}>
                <Stars/>
            </group>
            <MainCamera/>
        </Suspense>
    )
}

export default TransitionsBetweenScenes;