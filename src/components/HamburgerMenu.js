import React, { useState } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../context/PlayerContext';
import Dashboard from './Dashboard';

const MenuContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const MenuButton = styled.button`
  background: #2196F3;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);

  &:hover {
    background: #1976D2;
  }

  span {
    display: block;
    width: 25px;
    height: 3px;
    background: white;
    border-radius: 3px;
    transition: all 0.3s ease;
  }
`;

const MenuContent = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: ${props => props.isOpen ? 'block' : 'none'};
  min-width: 300px;
  max-height: 80vh;
  overflow-y: auto;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 16px;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { setShowNameModal } = usePlayer();

  const handleChangeName = () => {
    setShowNameModal(true);
    setIsOpen(false);
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
    setIsOpen(false);
  };

  const handleCloseDashboard = () => {
    setShowDashboard(false);
  };

  return (
    <MenuContainer>
      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        <span />
        <span />
        <span />
      </MenuButton>
      <MenuContent isOpen={isOpen}>
        <MenuItem onClick={toggleDashboard}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          პროგრესი
        </MenuItem>
        <MenuItem onClick={handleChangeName}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          სახელის შეცვლა
        </MenuItem>
      </MenuContent>
      {showDashboard && <Dashboard onClose={handleCloseDashboard} />}
    </MenuContainer>
  );
};

export default HamburgerMenu;