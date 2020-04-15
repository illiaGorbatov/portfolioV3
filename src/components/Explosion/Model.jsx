import React from 'react';
import * as THREE from 'three';
import {useLoader} from "react-three-fiber";

import nx from '../../newsky/nx.jpg';
import ny from '../../newsky/ny.jpg';
import nz from '../../newsky/nz.jpg';
import px from '../../newsky/px.jpg';
import py from '../../newsky/py.jpg';
import pz from '../../newsky/pz.jpg';

import eggModel from '../../models/egg-thick.glb'

import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import EggThick from "../../models/EggThick";


const Model = () => {

    const textures = useLoader(THREE.CubeTextureLoader, [nx, ny, nz, px, py, pz]);
    const egg = useLoader(GLTFLoader, eggModel, loader => {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/examples/js/libs/draco')
        loader.setDRACOLoader(dracoLoader)
    });


    return(
        <EggThick/>
    )
};

export default Model