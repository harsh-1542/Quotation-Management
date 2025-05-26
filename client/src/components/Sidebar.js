import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import './Sidebar.css';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  padding: 2rem 1.5rem;
  position: sticky;
  top: 0;
  color: white;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 200px;
    padding: 1.5rem 1rem;
  }
`;

const Logo = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  text-align: center;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin: 0.8rem 0;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 6px;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: #fff;
    transform: scaleY(0);
    transition: transform 0.2s, width 0.4s cubic-bezier(1, 0, 0, 1) 0.2s;
  }

  &:hover::before {
    transform: scaleY(1);
    width: 100%;
    opacity: 0.2;
  }
`;

const MenuLink = styled(Link)`
  display: block;
  padding: 0.8rem 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover {
    color: white;
    padding-left: 1.2rem;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo>Quotation System</Logo>
      <MenuList>
        <MenuItem>
          <MenuLink to="/quotation-form">Quotation Form</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/quotation-list">Client (Quotation) List</MenuLink>
        </MenuItem>
      </MenuList>
    </SidebarContainer>
  );
};

export default Sidebar;