import React from 'react';
import styled from 'styled-components';
import Navigation from "./Navigation";

const Logo = styled.div`
  position: absolute;
  z-index: 999;
  top: 20px;
  color: white;
  left: 20px;
  font-size: 50px;
  font-family: "Anders";
`;

const Menu = styled.div`
  position: absolute;
  z-index: 999;
  top: 20px;
  right: 20px;
  color: white;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MenuDotsWrapper = styled.div`
  width: 35px;
  height: 17px;
  position: relative;
  margin-left: 15px;
  cursor: pointer;
 `;

const MenuDots = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: white;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  &:nth-child(1) {
    left: 0
  };
  &:nth-child(2) {
    left: 10px;
  };
  &:nth-child(3) {
    left: 20px;
  }
`;


const Header = (props) => {

    const onMenuClickHandler = () => {
        if (!props.isNavMenuOpened) {
            props.switchNavMenu();
        }
    };

    return (
        <>
            <Logo>
                Horbatov
            </Logo>
            {!props.isNavMenuOpened &&
            <Menu>
                Menu
                <MenuDotsWrapper onClick={onMenuClickHandler}>
                    <MenuDots/>
                    <MenuDots/>
                    <MenuDots/>
                </MenuDotsWrapper>
            </Menu>}
            {props.isNavMenuOpened &&
            <Navigation switchNavMenu={props.switchNavMenu}/>
            }
        </>
    )
};

export default Header;