import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2196F3;
  margin-bottom: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

const DifficultyButton = styled.button`
  background-color: ${props => props.active ? '#2196F3' : '#4CAF50'};
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const difficulties = [
  { size: 3, label: 'მარტივი (3x3)' },
  { size: 4, label: 'მარტივი (4x4)' },
  { size: 6, label: 'საშუალო (6x6)' },
  { size: 8, label: 'საშუალო (8x8)' },
  { size: 12, label: 'რთული (12x12)' }
];

const DifficultySelector = ({ difficulty, setDifficulty }) => {
  return (
    <Container>
      <Title>აირჩიე სირთულის დონე</Title>
      <ButtonGroup>
        {difficulties.map(({ size, label }) => (
          <DifficultyButton
            key={size}
            active={difficulty === size}
            onClick={() => setDifficulty(size)}
          >
            {label}
          </DifficultyButton>
        ))}
      </ButtonGroup>
    </Container>
  );
};

export default DifficultySelector;
