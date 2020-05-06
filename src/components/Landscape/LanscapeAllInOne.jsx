import React, {Suspense} from 'react';
import LandscapeSky from "./LandscapeSky";
import Land from "./land";
import LandscapeCamera from "./LandscapeCamera";

const LandscapeAllInOne = () => {
    return (
        <Suspense fallback={null}>
            <fog attach="fog" args={['white', 0, 200]}/>
            <Land/>
            <LandscapeSky/>
            <LandscapeCamera/>
        </Suspense>
    )
};

export default LandscapeAllInOne