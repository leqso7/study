import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { tasks } from '../data/tasks';
import { createGlobalStyle } from 'styled-components';
import NameModal from './NameModal';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, #EBF3FE, #F3EFFE);
  overflow-y: auto;
`;

const TaskCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #1a237e;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);

  @media (min-width: 640px) {
    font-size: 1.875rem;
  }
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const NavigationButton = styled.button`
  background: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);

  &:hover {
    background: #388E3C;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  ${props => props.prev && `
    background: #1976D2;
    &:hover {
      background: #1565C0;
    }
  `}
`;

const MatchingGame = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 2rem 0;
  justify-content: center;
  align-items: center;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: stretch;
  margin: 1.5rem 0;
  width: 100%;
  max-width: 800px;
  padding: 0 1rem;
`;

const Item = styled.button`
  background: ${props => props.color || '#4CAF50'};
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 180px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem;
  white-space: normal;
  word-wrap: break-word;
  text-align: center;
  line-height: 1.2;
  overflow-wrap: break-word;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
  }

  ${props => props.selected && `
    transform: scale(0.95);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
  `}
`;

const MathGame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
`;

const MathProblem = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  background: white;
  padding: 1rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 300px;
`;

const NumberButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    background: #45a049;
  }

  &:active {
    transform: translateY(0);
  }
`;

const StickersContainer = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  margin: 25px 0;
`;

const StickersGroup = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-width: 120px;
  justify-content: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Sticker = styled.div`
  font-size: 2rem;
  animation: popIn 0.5s ease-out;
  
  @keyframes popIn {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

const Input = styled.input`
  padding: 15px;
  font-size: 1.5rem;
  border: 3px solid #2196F3;
  border-radius: 10px;
  width: 120px;
  text-align: center;
  margin: 0 10px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  background-color: ${props => props.disabled ? '#ccc' : '#4CAF50'};
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#45a049'};
  }
`;

const Message = styled.div`
  color: ${props => props.isCorrect ? '#4CAF50' : '#f44336'};
  font-size: 1.3rem;
  margin-top: 15px;
  text-align: center;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;

const HomeButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
  z-index: 100;

  &:hover {
    transform: scale(1.1);
  }
`;

const GlobalStyle = createGlobalStyle`
  @keyframes celebrate {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;

const celebrationStickers = ['🌟', '🎉', '🎈', '🎊', '🏆', '⭐', '💫', '✨'];

const showCelebration = (stickers) => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '1000';
  document.body.appendChild(container);

  // ცენტრალური სტიკერი
  const mainSticker = document.createElement('div');
  mainSticker.style.position = 'fixed';
  mainSticker.style.fontSize = '100px';
  mainSticker.style.zIndex = '1000';
  mainSticker.style.top = '50%';
  mainSticker.style.left = '50%';
  mainSticker.style.transform = 'translate(-50%, -50%)';
  mainSticker.style.animation = 'celebrate 1s ease-out forwards';
  mainSticker.textContent = stickers[Math.floor(Math.random() * stickers.length)];
  container.appendChild(mainSticker);

  // მფრინავი სტიკერები
  for (let i = 0; i < 15; i++) {
    const sticker = document.createElement('div');
    sticker.style.position = 'fixed';
    sticker.style.fontSize = '40px';
    sticker.style.zIndex = '999';
    sticker.style.left = Math.random() * 100 + 'vw';
    sticker.style.top = '100vh';
    sticker.style.animation = `float ${2 + Math.random() * 2}s linear forwards`;
    sticker.textContent = stickers[Math.floor(Math.random() * stickers.length)];
    container.appendChild(sticker);
  }

  setTimeout(() => {
    document.body.removeChild(container);
  }, 3000);
};

const Toast = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease-out forwards;
  font-size: 1.4rem;
  color: #2196F3;
  min-width: 300px;
  text-align: center;

  @keyframes slideIn {
    from {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`;

const ProgressIndicator = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  color: #1a237e;
  z-index: 100;
  transition: all 0.3s ease;

  span {
    color: #4CAF50;
    font-weight: bold;
    min-width: 25px;
    text-align: center;
  }

  &:hover {
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CompletedTaskOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  gap: 1rem;
  z-index: 10;

  h2 {
    color: #4CAF50;
    font-size: 1.5rem;
    margin: 0;
  }

  .stars {
    font-size: 2rem;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const RestartButton = styled(NavigationButton)`
  background: #9C27B0;
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;

  &:hover {
    background: #7B1FA2;
  }
`;

const CompletionMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #4CAF50;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .celebration {
    font-size: 3rem;
    margin: 1rem 0;
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

const Tasks = () => {
  const { playerName, showNameModal, gameProgress, updateGameProgress, updatePlayerName } = usePlayer();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [answer, setAnswer] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [feedback, setFeedback] = useState({ show: false });
  const [answers, setAnswers] = useState({});
  const [isVisible, setIsVisible] = useState(true);
  const [shuffledItems, setShuffledItems] = useState([]);
  const [shuffledColors, setShuffledColors] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const navigate = useNavigate();

  console.log('Tasks array:', tasks);
  console.log('Current task index:', currentTaskIndex);
  console.log('Current task:', tasks[currentTaskIndex]);
  console.log('Tasks array length:', tasks.length);

  const currentTask = tasks[currentTaskIndex];

  const totalTasks = tasks.length;
  const completedTasks = gameProgress?.completedTasks || [];

  useEffect(() => {
    console.log('Tasks array:', tasks);
    console.log('Current task index:', currentTaskIndex);
    console.log('Current task:', currentTask);
    console.log('Tasks array length:', tasks.length);

    if (gameProgress?.completedTasks) {
      // ვითვლით მხოლოდ უნიკალურ დასრულებულ დავალებებს
      const uniqueCompletedTasks = new Set(gameProgress.completedTasks);
      setCompletedTasksCount(uniqueCompletedTasks.size);
    }
  }, [gameProgress?.completedTasks, tasks, currentTaskIndex, currentTask]);

  const handleSuccess = useCallback(() => {
    const currentTask = tasks[currentTaskIndex];
    
    // ვანახლებთ პროგრესს მხოლოდ თუ დავალება ჯერ არ არის დასრულებული
    if (!gameProgress?.completedTasks?.includes(currentTaskIndex)) {
      updateGameProgress('task', currentTaskIndex);
    }

    setFeedback({
      show: true,
      message: 'სწორია! 🎉',
      type: 'success'
    });

    showCelebration(currentTask.stickers || ['🌟']);

    // გადავდივართ შემდეგ დავალებაზე
    setTimeout(() => {
      setFeedback({ show: false });
      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(prev => prev + 1);
      }
    }, 1500);
  }, [currentTaskIndex, tasks, updateGameProgress, gameProgress?.completedTasks, showCelebration]);

  const handleNumberClick = useCallback((number) => {
    setSelectedNumbers(prev => {
      const newSelection = [...prev];
      const index = newSelection.indexOf(number);
      if (index === -1) {
        newSelection.push(number);
      } else {
        newSelection.splice(index, 1);
      }
      return newSelection;
    });
  }, []);

  const findNextUncompletedTask = useCallback((currentIndex, direction = 1) => {
    let nextIndex = currentIndex;
    const totalTasks = tasks.length;
    const completedTasks = gameProgress?.completedTasks || [];
    
    do {
      nextIndex = (nextIndex + direction + totalTasks) % totalTasks;
      if (!completedTasks.includes(nextIndex)) {
        return nextIndex;
      }
    } while (nextIndex !== currentIndex);
    
    return currentIndex;
  }, [gameProgress?.completedTasks]);

  const handleNextTask = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      const nextIndex = findNextUncompletedTask(currentTaskIndex);
      setCurrentTaskIndex(nextIndex);
      setIsVisible(true);
    }, 300);
  }, [currentTaskIndex, findNextUncompletedTask]);

  const handlePrevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const handleAnswerSubmit = useCallback((selectedAnswer) => {
    if (!currentTask?.answer) {
      console.error('No correct answer defined for task');
      return;
    }

    const isCorrect = Number(selectedAnswer) === Number(currentTask.answer);
    
    setFeedback({
      show: true,
      message: isCorrect ? 'სწორია! 🎉' : 'სცადე თავიდან! 🤔',
      type: isCorrect ? 'success' : 'error'
    });

    if (isCorrect) {
      // განვაახლოთ პროგრესი მხოლოდ თუ ეს დავალება ჯერ არ არის დასრულებული
      if (!gameProgress?.completedTasks?.includes(currentTaskIndex)) {
        updateGameProgress('task', currentTaskIndex);
      }

      showCelebration(currentTask.stickers || ['🌟']);

      setTimeout(() => {
        setFeedback({ show: false });
        if (currentTaskIndex < tasks.length - 1) {
          setCurrentTaskIndex(prev => prev + 1);
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setFeedback({ show: false });
      }, 1500);
    }
  }, [currentTask, currentTaskIndex, updateGameProgress, showCelebration, gameProgress?.completedTasks]);

  const showToast = useCallback((message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2000);
  }, []);

  const handleColorClick = useCallback((index) => {
    setSelectedColors(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      
      if (selectedNumbers.length === 0) return prev;
      
      const numberIndex = selectedNumbers[0];
      const selectedItem = shuffledItems[numberIndex];
      const selectedOption = shuffledColors[index];
      
      // Check if this is a correct match based only on colorName
      const isCorrectMatch = selectedItem.colorName === selectedOption.name && !selectedItem.matched;
      
      if (isCorrectMatch) {
        // Correct match
        const praise = currentTask.praise[Math.floor(Math.random() * currentTask.praise.length)];
        
        // Update shuffledItems immutably
        const newShuffledItems = shuffledItems.map((item, idx) => {
          if (idx === numberIndex) {
            return { ...item, matched: true };
          }
          return item;
        });
        setShuffledItems(newShuffledItems);
        
        const allMatched = newShuffledItems.every((item) => item.matched);
        if (allMatched) {
          handleSuccess();
          showCelebration(currentTask.stickers);
          setTimeout(handleNextTask, 1500);
        } else {
          showToast(praise);
        }
      } else {
        // Wrong match
        showToast(currentTask.hint);
      }
      
      setSelectedNumbers([]);
      return [];
    });
  }, [currentTask, selectedNumbers, shuffledItems, shuffledColors, handleNextTask, showToast, handleSuccess]);

  const renderMatchingGame = useCallback((task) => {
    if (!task?.items || !task?.colorOptions) {
      return null;
    }

    return (
      <MatchingGame>
        <ItemsContainer>
          {shuffledItems.map((item, index) => (
            <Item
              key={index}
              color={item.color}
              selected={selectedNumbers.includes(index)}
              onClick={() => handleNumberClick(index)}
              disabled={item.matched}
              fontSize={item.fontSize}
            >
              <span>{item.number}</span>
              {item.text && <span style={{ marginLeft: '8px' }}>{item.text}</span>}
            </Item>
          ))}
        </ItemsContainer>
        <ItemsContainer>
          {shuffledColors.map((option, index) => (
            <Item
              key={index}
              style={{ background: option.color }}
              selected={selectedColors.includes(index)}
              onClick={() => handleColorClick(index)}
              disabled={shuffledItems.find(item => item.colorName === option.name)?.matched}
            >
              {option.name}
            </Item>
          ))}
        </ItemsContainer>
      </MatchingGame>
    );
  }, [handleColorClick, handleNumberClick, selectedColors, selectedNumbers, shuffledItems, shuffledColors]);

  const renderMathGame = useCallback((task) => {
    if (!task?.options) {
      console.log('No options found for math task:', task);
      return null;
    }

    return (
      <MathGame>
        <MathProblem>
          {task.problem}
        </MathProblem>
        <NumberGrid>
          {task.options.map((number, i) => (
            <NumberButton
              key={i}
              onClick={() => handleAnswerSubmit(number)}
            >
              {number}
            </NumberButton>
          ))}
        </NumberGrid>
      </MathGame>
    );
  }, [handleAnswerSubmit]);

  const handleRestart = useCallback(() => {
    const shouldRestart = window.confirm('ნამდვილად გსურთ თავიდან დაწყება? პროგრესი განულდება.');
    if (shouldRestart) {
      updateGameProgress(-1, 0); // ეს გაასუფთავებს პროგრესს PlayerContext-ში
      setCurrentTaskIndex(0);
      setSelectedNumbers([]);
      setSelectedColors([]);
      setAnswers({});
      setFeedback({});
      window.location.reload(); // გვერდის გადატვირთვა პროგრესის განულების შემდეგ
    }
  }, [updateGameProgress]);

  useEffect(() => {
    if (currentTask?.type === 'matching') {
      const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
      };

      if (currentTask.colorOptions) {
        setShuffledColors(shuffleArray(currentTask.colorOptions));
      }
      if (currentTask.items) {
        setShuffledItems(shuffleArray(currentTask.items));
      }
    }
  }, [currentTask]);

  if (showNameModal) {
    return <NameModal onSubmit={updatePlayerName} />;
  }

  return (
    <Container>
      <GlobalStyle />
      {toast.show && <Toast>{toast.message}</Toast>}
      <ProgressIndicator>
        შესრულებულია: {completedTasksCount} / {tasks.length}
      </ProgressIndicator>
      <TaskCard>
        <Title>
          <span>სახალისო ამოცანები</span>
          {gameProgress?.taskScores?.[currentTaskIndex] && (
            <span>{'⭐'.repeat(gameProgress.taskScores[currentTaskIndex])}</span>
          )}
        </Title>
        <Subtitle>{currentTask?.description || 'Loading...'}</Subtitle>

        {isVisible && (
          <div style={{ position: 'relative' }}>
            {completedTasksCount === totalTasks ? (
              <CompletionMessage>
                <div className="celebration">🎉</div>
                <div>ყოჩაღ! ყველა დავალება შეასრულე!</div>
                <RestartButton onClick={handleRestart}>
                  თავიდან დაწყება 🔄
                </RestartButton>
              </CompletionMessage>
            ) : (
              <>
                {currentTask?.type === 'matching' && renderMatchingGame(currentTask)}
                {currentTask?.type === 'math' && renderMathGame(currentTask)}
              </>
            )}
          </div>
        )}

        <NavigationButtons>
          <Button 
            onClick={handlePrevTask}
            disabled={currentTaskIndex === 0}
          >
            წინა
          </Button>
          <Button 
            onClick={handleNextTask}
            disabled={currentTaskIndex === tasks.length - 1}
          >
            შემდეგი
          </Button>
        </NavigationButtons>
      </TaskCard>
    </Container>
  );
};

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

export default React.memo(Tasks);
