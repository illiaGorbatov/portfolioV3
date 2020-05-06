import React from 'react';
import styled from "styled-components";
import image from "../../../assets/images/CodeRepeat.jpg"
import {animated} from "react-spring";

const AboutWrapper = styled(animated.div)`
  position: absolute;
  display: flex;
  flex-grow: 0;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: white;
`;

const BlackSide = styled(animated.div)`
  position: absolute;
  height: 100%;
  width: 100%;
  background: black;
  opacity: 0.5;
  z-index: 1;
`;

const Image = styled.div`
  background: center / cover no-repeat url("${image}");
  width: 50%;
  height: 50vh;
  z-index: 2;
  padding: 15px;
  background-clip: content-box;
`;

const TextWrapper = styled.div`
  font-family: 'Made Evolve Sans Light';
  font-size: 20px;
  z-index: 2;
  width: 50%;
  padding: 15px;
`;


const AboutMe = () => {
    return (
        <AboutWrapper>
            <Image/>
            <TextWrapper> Кто я?
                Простой парень, решивший в один прекрасный день заняться программированием в целом и frontend
                разработкой в частности.
                Люблю чай (много чая), изучение новых технологий, а также углубление в тонкости уже изученных.
                Судя по всему, являюсь перфекционистом (в кодинге точно), поэтому чувствую желание доводить начатое до
                конца и делать это красиво.
            </TextWrapper>
            <BlackSide/>
        </AboutWrapper>
    )
};

export default AboutMe