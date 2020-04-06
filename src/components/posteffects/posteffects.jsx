import React from "react";
import * as THREE from 'three';
import {extend} from "react-three-fiber";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";

extend({EffectComposer, ShaderPass, RenderPass});
