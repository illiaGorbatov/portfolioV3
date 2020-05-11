import React, {useRef, useState} from 'react';
import styled from "styled-components";
import {getState, useStore} from "../../../utils/zustandStore";
import {useSpring, useTransition, useChain, animated} from "react-spring";
import image1 from "../../../assets/images/CodeRepeat.jpg";
import image2 from "../../../assets/images/BsckCoding.jpg";
import image3 from "../../../assets/images/js.png";
import image4 from "../../../assets/images/MainBackground-3.jpg";

const OpenMyProjects = styled(animated.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: white;
  font-size: 20px;
  background-color: rgb(21, 22, 22);
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
  
`;

const Project = styled(animated.div)`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 5px;
  will-change: transform, opacity;
`;

const projectsArray = [
    {image: image1, name: 'Amethyst'},
    {image: image2, name: 'The Counter'},
    {image: image3, name: 'Portfolio'},
    {image: image4, name: 'Social Network'}
];

const Projects = () => {

    const open = useStore(state => state.exploded)

    const springRef = useRef();
    const button = useSpring({
        ref: springRef,
        from: {
            opacity: 1,
            width: '10%',
            height: '10%'
        },
        to: {
            opacity: 0.5,
            width: '60%',
            height: '70%'
        }
    });

    const transitionRef = useRef();
    const projects = useTransition(projectsArray, null, {
        ref: transitionRef,
        trail: 400,
        from: { opacity: 0, transform: 'scale(0)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0)' }
    });

    useChain(open ? [springRef, transitionRef] : [transitionRef, springRef]);

    return (
        <OpenMyProjects style={button} onClick={() => {
            getState().setExploded(true)
        }}>
            Мои работы
            {projects.map(({item, props, key}, i) => {debugger
                    return <Project key={i} style={{...props, backgroundImage: `url(${projectsArray[i].image})`}}>
                        {projectsArray[i].name}
                    </Project>}
                )}
        </OpenMyProjects>
    )
};

export default Projects