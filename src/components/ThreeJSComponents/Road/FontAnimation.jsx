import React from 'react';
import BasicFont from "../MainPageFont/BasicFont";
import LandscapeCamera from "../Landscape/LandscapeCamera";

const FontAnimation = () => {



    return(
    <>
        <BasicFont children={"Приветствую !"} position={[0, 15, -60]}/>
        <BasicFont children={"Меня зовут Илья"} position={[0, 15, -50]}/>
        <BasicFont children={"И я"} position={[0, 15, -40]}/>
        <BasicFont children={"REACT-РАЗРАБОТЧИК"} position={[0, 15, -30]}/>
        <LandscapeCamera position={[0, 15, -40]} fov={65} far={200000}/>
    </>
)
}

export default FontAnimation