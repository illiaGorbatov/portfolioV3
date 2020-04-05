import React from "react";
import * as THREE from "three";

export default () => {

    return (
        <group>
            <spotLight intensity={1.2} position={[-10, 3, 10]}
                       penumbra={0.5} angle={THREE.Math.degToRad(60)} color='violet' castShadow
                       shadowMapWidth={2048} shadowMapHeight={2048}/>
            <spotLight intensity={1.2} position={[10, 3, 10]}
                       penumbra={0.5} angle={THREE.Math.degToRad(60)} color='blue' castShadow
                       shadowMapWidth={2048} shadowMapHeight={2048}/>
        </group>
    );
};
