import React, { useMemo } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../context/PlayerContext';

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #ff4444;
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 68, 68, 0.1);
    transform: scale(1.1);
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 2px;
    background-color: currentColor;
    border-radius: 1px;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const Title = styled.h2`
  color: #2196F3;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.background || '#f5f5f5'};
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2196F3;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: ${props => props.value}%;
  height: 100%;
  background: ${props => props.color || '#2196F3'};
  transition: width 0.3s ease;
`;

const DifficultyBreakdown = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
`;

const DifficultyTitle = styled.h3`
  color: #2196F3;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const DifficultyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const Statistics = ({ onClose }) => {
  const { gameProgress } = usePlayer();
  
  // თუ gameProgress არის undefined ან არ აქვს puzzles მასივი
  if (!gameProgress || !Array.isArray(gameProgress.puzzles)) {
    return (
      <Container>
        <CloseButton onClick={onClose} />
        <Title>📊 სტატისტიკა ცარიელია</Title>
        <p>ჯერ არ გაქვთ დასრულებული არცერთი თამაში</p>
      </Container>
    );
  }

  const puzzles = gameProgress.puzzles;

  const stats = useMemo(() => {
    if (!puzzles.length) return null;

    const totalPuzzles = puzzles.length;
    const totalErrors = puzzles.reduce((sum, p) => sum + (p.errors || 0), 0);
    const avgErrors = (totalErrors / totalPuzzles).toFixed(2);
    const perfectPuzzles = puzzles.filter(p => p.errors === 0).length;
    
    // სირთულის მიხედვით სტატისტიკა
    const byDifficulty = {
      2: puzzles.filter(p => p.difficulty === 2),
      3: puzzles.filter(p => p.difficulty === 3),
      4: puzzles.filter(p => p.difficulty === 4),
      5: puzzles.filter(p => p.difficulty === 5)
    };

    const difficultyProgress = {
      2: byDifficulty[2].length ? Math.round((byDifficulty[2].length / totalPuzzles) * 100) : 0,
      3: byDifficulty[3].length ? Math.round((byDifficulty[3].length / totalPuzzles) * 100) : 0,
      4: byDifficulty[4].length ? Math.round((byDifficulty[4].length / totalPuzzles) * 100) : 0,
      5: byDifficulty[5].length ? Math.round((byDifficulty[5].length / totalPuzzles) * 100) : 0
    };

    const recommendedDifficulty = (() => {
      if (!totalPuzzles) return 2;
      if (avgErrors > 3) return 2;
      if (difficultyProgress[2] >= 70 && avgErrors <= 1) return 3;
      if (difficultyProgress[3] >= 70 && avgErrors <= 2) return 4;
      if (difficultyProgress[4] >= 70 && avgErrors <= 1) return 5;
      return Math.min(5, Math.max(2, 
        2 + Math.floor((100 - avgErrors * 20) / 30)
      ));
    })();

    return {
      learningProgress: Math.round((perfectPuzzles / totalPuzzles) * 100),
      avgErrors,
      recentAvgErrors: puzzles.slice(-5).reduce((sum, p) => sum + (p.errors || 0), 0) / Math.min(puzzles.length, 5),
      recommendedDifficulty,
      difficultyProgress,
      byDifficulty: {
        2: {
          count: byDifficulty[2].length,
          avgErrors: byDifficulty[2].length ? 
            (byDifficulty[2].reduce((sum, p) => sum + (p.errors || 0), 0) / byDifficulty[2].length).toFixed(2) : 0,
          perfectCount: byDifficulty[2].filter(p => p.errors === 0).length
        },
        3: {
          count: byDifficulty[3].length,
          avgErrors: byDifficulty[3].length ? 
            (byDifficulty[3].reduce((sum, p) => sum + (p.errors || 0), 0) / byDifficulty[3].length).toFixed(2) : 0,
          perfectCount: byDifficulty[3].filter(p => p.errors === 0).length
        },
        4: {
          count: byDifficulty[4].length,
          avgErrors: byDifficulty[4].length ?
            (byDifficulty[4].reduce((sum, p) => sum + (p.errors || 0), 0) / byDifficulty[4].length).toFixed(2) : 0,
          perfectCount: byDifficulty[4].filter(p => p.errors === 0).length
        },
        5: {
          count: byDifficulty[5].length,
          avgErrors: byDifficulty[5].length ?
            (byDifficulty[5].reduce((sum, p) => sum + (p.errors || 0), 0) / byDifficulty[5].length).toFixed(2) : 0,
          perfectCount: byDifficulty[5].filter(p => p.errors === 0).length
        }
      }
    };
  }, [puzzles]);

  if (!stats) {
    return (
      <Container>
        <CloseButton onClick={onClose} />
        <Title>📊 სტატისტიკა ცარიელია</Title>
        <p>ჯერ არ გაქვთ დასრულებული არცერთი თამაში</p>
      </Container>
    );
  }

  return (
    <Container>
      <CloseButton onClick={onClose} />
      <Title>📊 მოსწავლის სწავლის ანალიზი</Title>
      
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.avgErrors}</StatValue>
          <StatLabel>საშუალო შეცდომები</StatLabel>
          <StatLabel>
            {stats.recentAvgErrors < stats.avgErrors 
              ? '🎯 ბოლო თამაშები უკეთესია!' 
              : '💪 კიდევ სცადე გაუმჯობესება'}
          </StatLabel>
        </StatCard>

        <DifficultyBreakdown>
          <DifficultyTitle>სირთულის მიხედვით</DifficultyTitle>
          <DifficultyGrid>
            {[2, 3, 4, 5].map((level) => (
              <StatCard key={level} background={level === stats.recommendedDifficulty ? '#e3f2fd' : '#f5f5f5'}>
                <StatValue>{stats.byDifficulty[level].count}</StatValue>
                <StatLabel>{level}x{level} პაზლები</StatLabel>
                <StatLabel>
                  უშეცდომო: {stats.byDifficulty[level].perfectCount}
                </StatLabel>
                <StatLabel>
                  საშუალო შეცდომები: {stats.byDifficulty[level].avgErrors}
                </StatLabel>
              </StatCard>
            ))}
          </DifficultyGrid>
        </DifficultyBreakdown>
      </StatsGrid>
    </Container>
  );
};

export default Statistics; 