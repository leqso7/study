import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const MenuTitle = styled.h1`
  color: #2196F3;
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
`;

const MenuItem = styled.button`
  background-color: white;
  border: 2px solid #2196F3;
  border-radius: 15px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MenuIcon = styled.span`
  font-size: 3rem;
`;

const MenuText = styled.span`
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;
`;

const MenuDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
`;

const MainMenu = () => {
  const navigate = useNavigate();

  const handleGameSelect = (gameType) => {
    switch (gameType) {
      case 'tasks':
        navigate('/tasks');
        break;
      case 'puzzles':
        navigate('/puzzle');
        break;
      case 'scramble':
        navigate('/scramble');
        break;
      case 'drawing':
        navigate('/drawing');
        break;
      default:
        break;
    }
  };

  return (
    <MenuContainer>
      <MenuTitle>🌟 სახალისო თამაშები 🌟</MenuTitle>
      <MenuGrid>
        <MenuItem onClick={() => navigate('/tasks')}>
          <MenuIcon>🎯</MenuIcon>
          <MenuTitle>სახალისო ამოცანები</MenuTitle>
          <MenuDescription>გამოიცანი და ამოხსენი</MenuDescription>
        </MenuItem>

        <MenuItem onClick={() => navigate('/memory-game')}>
          <MenuIcon>🧠</MenuIcon>
          <MenuTitle>მეხსიერების თამაში</MenuTitle>
          <MenuDescription>დაიმახსოვრე და გაიხსენე სურათების თანმიმდევრობა</MenuDescription>
        </MenuItem>

        <MenuItem onClick={() => navigate('/scramble')}>
          <MenuIcon>🎲</MenuIcon>
          <MenuTitle>სიტყვების თამაში</MenuTitle>
          <MenuDescription>ისწავლე ახალი სიტყვები გართობით</MenuDescription>
        </MenuItem>

        <MenuItem onClick={() => navigate('/puzzle')}>
          <MenuIcon>🧩</MenuIcon>
          <MenuTitle>პაზლები</MenuTitle>
          <MenuDescription>ააწყვე სახალისო პაზლები</MenuDescription>
        </MenuItem>
      </MenuGrid>
    </MenuContainer>
  );
};

export default MainMenu;
