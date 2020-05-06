import React, {Suspense} from 'react';
import Model from "./Model";
import Camera from "../Camera";
import Stars from "./stars";
import ExplosionCamera from "./ExplosionCamera";

const ExplosionAllInOne = () => {
    return(
        <Suspense fallback={null}>
            <Model/>
            <ExplosionCamera far={2000000} position={[0, 0, 1000]} fov={65}/>
            <Stars/>
        </Suspense>
    )
};

export default ExplosionAllInOne