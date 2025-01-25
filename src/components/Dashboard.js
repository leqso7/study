import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { motion } from 'framer-motion';
import { Book, AlignLeft, PuzzleIcon as PuzzlePiece } from 'lucide-react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom right, #1a237e, #4a148c, #880e4f);
  padding: 2rem;
  color: white;
  overflow-y: auto;
  z-index: 1000;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  transition: all 0.2s;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active ? '#4a148c' : 'white'};
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const StatsCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const StatsHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const StatsGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
    text-align: center;
  }
`;

const StatValue = styled.p`
  font-size: 3rem;
  font-weight: bold;
  
  span {
    font-size: 1.5rem;
    font-weight: normal;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;

    span {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 2rem;

    span {
      font-size: 1rem;
    }
  }
`;

const StatLabel = styled.p`
  font-size: 1.125rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ProgressBar = styled.div`
  background: rgba(255, 255, 255, 0.2);
  height: 1rem;
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 1.5rem;
`;

const Progress = styled.div`
  height: 100%;
  border-radius: 9999px;
  background: ${props => {
    switch (props.type) {
      case 'tasks':
        return '#4caf50';
      case 'scramble':
        return '#2196f3';
      case 'puzzle':
        return '#ffc107';
      default:
        return '#4caf50';
    }
  }};
  width: ${props => props.percent}%;
`;

const ProgressText = styled.p`
  text-align: right;
  margin-top: 0.5rem;
`;

const Dashboard = () => {
  const { playerName, gameProgress } = usePlayer();
  const [activeTab, setActiveTab] = useState('puzzle');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let newChartData = [];
    
    // ფილტრავს მხოლოდ 3x3 პაზლებს
    const puzzles3x3 = gameProgress.puzzles
      ?.filter(puzzle => puzzle.difficulty === 3)
      ?.slice(-7) || [];

    // აგენერირებს მონაცემებს გრაფიკისთვის
    puzzles3x3.forEach(puzzle => {
      newChartData.push({
        name: new Date(puzzle.date).toLocaleDateString('ka-GE', { weekday: 'short' }),
        შეცდომები: puzzle.errors
      });
    });
    
    setChartData(newChartData);
  }, [gameProgress]);

  const calculateProgress = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  const getTotalTasks = () => {
    switch (activeTab) {
      case 'tasks':
        return 100;
      case 'scramble':
        return 30;
      case 'puzzle':
        return Math.max(10, gameProgress.completedPuzzles.length);
      default:
        return 0;
    }
  };

  const renderStats = () => {
    const total = getTotalTasks();
    let completed;
    let progressText;

    switch (activeTab) {
      case 'tasks':
        completed = gameProgress.completedTasks.length;
        progressText = `${completed} / ${total} სახალისო დავალება`;
        break;
      case 'scramble':
        completed = gameProgress.completedScrambleTasks.length;
        progressText = `${completed} / ${total} ასოების დალაგება`;
        break;
      case 'puzzle':
        completed = gameProgress.completedPuzzles.length;
        progressText = `${completed} დასრულებული პაზლი`;
        break;
      default:
        completed = 0;
        progressText = '';
    }

    const progress = calculateProgress(completed, activeTab === 'puzzle' ? completed : total);

    return (
      <StatsCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <StatsHeader>{progressText}</StatsHeader>
        <StatsGrid>
          <div>
            <StatValue>
              {completed} <span>{activeTab !== 'puzzle' && ` / ${total}`}</span>
            </StatValue>
            <StatLabel>{activeTab === 'puzzle' ? 'დასრულებული პაზლები' : 'შესრულებული დავალებები'}</StatLabel>
          </div>
          {activeTab !== 'puzzle' && (
            <div>
              <StatValue>
                {Object.values(gameProgress.taskScores).length > 0
                  ? (Object.values(gameProgress.taskScores).reduce((a, b) => a + b, 0) / Object.values(gameProgress.taskScores).length).toFixed(1)
                  : '0.0'}
              </StatValue>
              <StatLabel>საშუალო ქულა</StatLabel>
            </div>
          )}
        </StatsGrid>
        <ProgressBar>
          <Progress
            type={activeTab}
            percent={progress}
          />
        </ProgressBar>
        <ProgressText>
          {progress}% დასრულებული
        </ProgressText>
      </StatsCard>
    );
  };

  return (
    <DashboardContainer>
      <ContentWrapper>
        <Title>მოგესალმები, {playerName}! 👋</Title>

        <TabContainer>
          <TabButton
            active={activeTab === 'tasks'}
            onClick={() => setActiveTab('tasks')}
          >
            <Book size={window.innerWidth <= 480 ? 16 : 20} />
            <span>სახალისო</span>
          </TabButton>
          <TabButton
            active={activeTab === 'scramble'}
            onClick={() => setActiveTab('scramble')}
          >
            <AlignLeft size={window.innerWidth <= 480 ? 16 : 20} />
            <span>ასოები</span>
          </TabButton>
          <TabButton
            active={activeTab === 'puzzle'}
            onClick={() => setActiveTab('puzzle')}
          >
            <PuzzlePiece size={window.innerWidth <= 480 ? 16 : 20} />
            <span>პაზლები</span>
          </TabButton>
        </TabContainer>

        {renderStats()}
      </ContentWrapper>
    </DashboardContainer>
  );
};

export default Dashboard;
