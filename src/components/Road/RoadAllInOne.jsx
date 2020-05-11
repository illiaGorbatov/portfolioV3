import React, {Suspense} from 'react';
import CarLights from "./CarLights";
import Effects from "./Effects";
import Camera from "../Camera";
import Stars from "../Explosion/stars";


const RoadAllInOne = () => {
    return (
        <Suspense fallback={null}>
            <Effects/>
            <CarLights/>
            <Stars/>
            <Camera position={[0, 8, -5]}/>
        </Suspense>
    )
};

export default RoadAllInOne