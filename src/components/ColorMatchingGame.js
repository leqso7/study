import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../context/PlayerContext';

const ColorMatchingGame = () => {
  const { updateGameProgress } = usePlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState(new Set());

  const colors = [
    { name: 'წითელი', value: '#FF0000' },
    { name: 'ლურჯი', value: '#0000FF' },
    { name: 'მწვანე', value: '#008000' },
    { name: 'ყვითელი', value: '#FFFF00' },
    { name: 'ნარინჯისფერი', value: '#FFA500' },
    { name: 'იისფერი', value: '#800080' },
    { name: 'შავი', value: '#000000' },
    { name: 'თეთრი', value: '#FFFFFF' }
  ];

  // თამაშის დაწყება
  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setMatchedPairs(new Set());
  };

  // ტაიმერის ლოგიკა
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // თამაშის დასრულება
  const endGame = () => {
    setIsPlaying(false);
    updateGameProgress('colorMatching', Date.now(), { score });
  };

  // ფერის ან სახელის არჩევა
  const handleSelection = (type, item) => {
    if (type === 'color') {
      setSelectedColor(item);
    } else {
      setSelectedName(item);
    }
  };

  // შემოწმება დაემთხვა თუ არა
  useEffect(() => {
    if (selectedColor && selectedName) {
      const isMatch = colors.find(c => c.value === selectedColor)?.name === selectedName;
      
      if (isMatch) {
        const newMatchedPairs = new Set(matchedPairs);
        newMatchedPairs.add(selectedColor);
        setMatchedPairs(newMatchedPairs);
        setScore(prev => prev + 1);
      }
      
      setSelectedColor(null);
      setSelectedName(null);
    }
  }, [selectedColor, selectedName]);

  return (
    <Container>
      <Title>ფერების დაკავშირება</Title>
      
      {!isPlaying ? (
        <StartButton onClick={startGame}>თამაშის დაწყება</StartButton>
      ) : (
        <GameArea>
          <Timer>დარჩენილი დრო: {timeLeft} წამი</Timer>
          <Score>ქულა: {score}</Score>
          
          <GameGrid>
            <ColorSection>
              {colors.map((color) => (
                <ColorBox
                  key={color.value}
                  color={color.value}
                  matched={matchedPairs.has(color.value)}
                  selected={selectedColor === color.value}
                  onClick={() => !matchedPairs.has(color.value) && handleSelection('color', color.value)}
                />
              ))}
            </ColorSection>
            
            <NameSection>
              {colors.map((color) => (
                <NameBox
                  key={color.name}
                  matched={matchedPairs.has(color.value)}
                  selected={selectedName === color.name}
                  onClick={() => !matchedPairs.has(color.value) && handleSelection('name', color.name)}
                >
                  {color.name}
                </NameBox>
              ))}
            </NameSection>
          </GameGrid>
        </GameArea>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const StartButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
  }
`;

const GameArea = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Timer = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Score = styled.div`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #333;
`;

const GameGrid = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
`;

const ColorSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const NameSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ColorBox = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${props => props.color};
  border: 3px solid ${props => props.selected ? '#333' : props.matched ? '#4CAF50' : '#ddd'};
  border-radius: 8px;
  cursor: ${props => props.matched ? 'default' : 'pointer'};
  opacity: ${props => props.matched ? 0.5 : 1};
`;

const NameBox = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 3px solid ${props => props.selected ? '#333' : props.matched ? '#4CAF50' : '#ddd'};
  border-radius: 8px;
  cursor: ${props => props.matched ? 'default' : 'pointer'};
  opacity: ${props => props.matched ? 0.5 : 1};
  padding: 0.5rem;
  font-size: 1rem;
`;

export default ColorMatchingGame; 