import React from 'react';
import {Canvas} from "react-three-fiber";
import * as THREE from 'three';
import Controls from "../controls/controls";

const Rpad = () => {
    return(
        <Canvas>
            <Controls/>
        </Canvas>
    );
};