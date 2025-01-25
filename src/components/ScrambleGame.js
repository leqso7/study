import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import '../styles/ScrambleGame.css';
import { usePlayer } from '../context/PlayerContext';
import NameModal from './NameModal';

const animals = [
  { name: 'ზებრა', image: 'ზებრა.webp' },
  { name: 'სპილო', image: 'სპილო.webp' },
  { name: 'ლომი', image: 'ლომი.webp' },
  { name: 'დათვი', image: 'დათვი.webp' },
  { name: 'მგელი', image: 'მგელო.webp' },
  { name: 'ირემი', image: 'ირემი.webp' },
  { name: 'თხა', image: 'თხა.webp' },
  { name: 'კურდღელი', image: 'კურდღელი.webp' },
  { name: 'ფლამინგო', image: 'ფლამინგო.webp' },
  { name: 'სელაპი', image: 'სელაპი.webp' },
  { name: 'ციყვი', image: 'ციყვი.webp' },
  { name: 'ენოტი', image: 'ენოტი.webp' },
  { name: 'ზარმაცა', image: 'ზარმაცა.webp' },
  { name: 'ზღარბი', image: 'ზღარბი.webp' },
  { name: 'ქამელეონი', image: 'ქამელეონი.webp' },
  { name: 'ოპოსუმი', image: 'ოპოსუმი.webp' },
  { name: 'რვაფეხა', image: 'რვაფეხა.webp' },
  { name: 'თახვი', image: 'თახვი.webp' },
  { name: 'ბეგემოტი', image: 'ბეგემოტი.webp' },
  { name: 'ლამა', image: 'ლამა.webp' },
  { name: 'ჟირაფი', image: 'ჟირაფი.webp' },
  { name: 'კენგურუ', image: 'კენგურუ.webp' },
  { name: 'ბუ', image: 'ბუ.webp' },
  { name: 'პანდა', image: 'პანდა.webp' },
  { name: 'მელია', image: 'მელია.webp' },
  { name: 'დელფინი', image: 'დელფინი.webp' },
  { name: 'კოალა', image: 'კოალა.webp' },
  { name: 'პინგვინი', image: 'პნგვინი.webp' },
  { name: 'კიბორჩხალა', image: 'კიბორჩხალა.webp' },
  { name: 'ობობა', image: 'ობობა.webp' },
  { name: 'გველი', image: 'გველი.webp' },
  { name: 'ხვლიკი', image: 'ხვლიკი.webp' },
  { name: 'ზვიგენი', image: 'ზვიგენი.webp' },
  { name: 'ფარშევანგი', image: 'ფარშევანგი.webp' },
  { name: 'კოდალა', image: 'კოდალა.webp' },
  { name: 'აქლემი', image: 'აქლემი.webp' },
  { name: 'პეპელა', image: 'პეპელა.webp' },
  { name: 'არწივი', image: 'არწივი.webp' }
];

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 1rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1000;
  animation: ${props => props.isClosing ? fadeOut : fadeIn} 0.5s ease forwards;
  backdrop-filter: blur(10px);
`;

const Container = styled.div`
  position: relative;
`;

const scrambleWord = (word) => {
  const originalLetters = word.split('');
  let scrambledIndices = Array.from({ length: word.length }, (_, i) => i);
  
  for (let i = 0; i < word.length; i++) {
    let currentIndex = scrambledIndices[i];
    if (currentIndex === i) {
      for (let j = i + 1; j < word.length; j++) {
        if (scrambledIndices[j] !== i) {
          [scrambledIndices[i], scrambledIndices[j]] = [scrambledIndices[j], scrambledIndices[i]];
          break;
        }
      }
      if (scrambledIndices[i] === i) {
        for (let j = i - 1; j >= 0; j--) {
          if (scrambledIndices[j] !== j) {
            [scrambledIndices[i], scrambledIndices[j]] = [scrambledIndices[j], scrambledIndices[i]];
            break;
          }
        }
      }
    }
  }
  
  return scrambledIndices.map((index, i) => ({
    id: `letter-${i}`,
    content: originalLetters[index],
    originalIndex: index
  }));
};

const ScrambleGame = () => {
  const { playerName, showNameModal, gameProgress, updateGameProgress } = usePlayer();
  const [currentAnimal, setCurrentAnimal] = useState(() => {
    const availableAnimals = animals.filter(animal => 
      !gameProgress?.completedScrambleTasks?.includes(animal.name)
    );
    return availableAnimals.length > 0 
      ? availableAnimals[Math.floor(Math.random() * availableAnimals.length)]
      : animals[Math.floor(Math.random() * animals.length)];
  });
  const [scrambledLetters, setScrambledLetters] = useState(() => 
    currentAnimal ? scrambleWord(currentAnimal.name) : []
  );
  const [placedLetters, setPlacedLetters] = useState(() => 
    currentAnimal ? Array(currentAnimal.name.length).fill(null) : []
  );
  const [correctPositions, setCorrectPositions] = useState([]);
  const [wrongPosition, setWrongPosition] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const lettersContainerRef = useRef(null);
  const targetContainerRef = useRef(null);
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastClosing, setIsToastClosing] = useState(false);

  const selectRandomAnimal = () => {
    const availableAnimals = animals.filter(animal => 
      !gameProgress?.completedScrambleTasks?.includes(animal.name)
    );
    
    if (availableAnimals.length === 0) {
      showNotification('გილოცავთ! თქვენ ყველა ამოცანა შეასრულეთ! 🎉');
      updateGameProgress('scramble', [], {});
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
      initializeAnimal(randomAnimal);
      setShowGame(true);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableAnimals.length);
    const randomAnimal = availableAnimals[randomIndex];
    initializeAnimal(randomAnimal);
    setShowGame(true);
  };

  const initializeAnimal = (animal) => {
    setCurrentAnimal(animal);
    setScrambledLetters(scrambleWord(animal.name));
    setPlacedLetters(Array(animal.name.length).fill(null));
    setCorrectPositions([]);
  };

  const handleDragStart = (e, letter, index) => {
    if (!letter) return;
    
    setDraggedLetter({
      letter: letter,
      index: index
    });
    e.target.classList.add('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedLetter) return;

    if (draggedLetter.letter.content !== currentAnimal.name[targetIndex]) {
      setWrongPosition(targetIndex);
      setTimeout(() => {
        setWrongPosition(null);
      }, 500);
      return;
    }

    const newPlacedLetters = [...placedLetters];
    const newScrambledLetters = [...scrambledLetters];

    newPlacedLetters[targetIndex] = draggedLetter.letter;
    newScrambledLetters.splice(draggedLetter.index, 1);

    setPlacedLetters(newPlacedLetters);
    setScrambledLetters(newScrambledLetters);

    const newCorrectPositions = [];
    newPlacedLetters.forEach((letter, index) => {
      if (letter && letter.content === currentAnimal.name[index]) {
        newCorrectPositions.push(index);
      }
    });

    setCorrectPositions(newCorrectPositions);

    if (newCorrectPositions.length === currentAnimal.name.length) {
      const newCompletedTasks = [...gameProgress.completedScrambleTasks, currentAnimal.name];
      updateGameProgress('scramble', newCompletedTasks, {
        ...gameProgress.scrambleScores,
        [currentAnimal.name]: 3
      });
      
      if (newCompletedTasks.length === animals.length) {
        showNotification('გილოცავთ! თქვენ ყველა ამოცანა შეასრულეთ! 🎉');
        updateGameProgress('scramble', [], {});
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        initializeAnimal(randomAnimal);
      } else {
        const availableAnimals = animals.filter(animal => !newCompletedTasks.includes(animal.name));
        const randomIndex = Math.floor(Math.random() * availableAnimals.length);
        const randomAnimal = availableAnimals[randomIndex];
        initializeAnimal(randomAnimal);
      }
    }
  };

  const startNewGame = () => {
    const availableAnimals = animals.filter(animal => !gameProgress.completedScrambleTasks.includes(animal.name));
    
    if (availableAnimals.length === 0) {
      showNotification('გილოცავთ! თქვენ ყველა ამოცანა შეასრულეთ! 🎉');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableAnimals.length);
    const randomAnimal = availableAnimals[randomIndex];
    initializeAnimal(randomAnimal);
    setShowGame(true);
  };

  const handleReset = () => {
    showNotification('თამაში იწყება თავიდან! 🎮');
    updateGameProgress('scramble', [], {});
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    initializeAnimal(randomAnimal);
    setShowGame(true);
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setIsToastClosing(true);
      setTimeout(() => {
        setShowToast(false);
        setIsToastClosing(false);
      }, 500);
    }, 3000);
  };

  useEffect(() => {
    const initializeGame = () => {
      const availableAnimals = animals.filter(animal => 
        !gameProgress?.completedScrambleTasks?.includes(animal.name)
      );
      if (availableAnimals.length === 0) {
        setShowGame(false);
        return;
      }
      
      const randomAnimal = availableAnimals[Math.floor(Math.random() * availableAnimals.length)];
      initializeAnimal(randomAnimal);
      setShowGame(true);
    };

    initializeGame();
  }, []);

  return (
    <div className="game-page">
      <div className="game-content">
        {showNameModal && <NameModal />}
        {showToast && (
          <Toast isClosing={isToastClosing}>
            {toastMessage}
          </Toast>
        )}
        <div className="game-area">
          <div className="progress-container">
            <span className="progress-text">შესრულებულია: {gameProgress?.completedScrambleTasks?.length || 0} / {animals.length}</span>
          </div>
          <h1 className="game-title">დაალაგე ასოები სწორად</h1>
          <p className="game-instructions">გადმოიტანე ასოები და ჩასვი სწორ ადგილას</p>
          <img 
            src={`${process.env.PUBLIC_URL}/photos/${currentAnimal.image}`}
            alt={currentAnimal.name} 
            className="animal-image" 
          />
          <div className="target-container">
            {placedLetters.map((letter, index) => (
              <div
                key={index}
                className={`letter-slot ${correctPositions.includes(index) ? 'correct' : ''} 
                          ${letter ? 'filled' : ''} 
                          ${wrongPosition === index ? 'wrong' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {letter && letter.content}
              </div>
            ))}
          </div>
          <div 
            ref={lettersContainerRef}
            className="letters-container"
          >
            {scrambledLetters.map((letter, index) => (
              <div
                key={letter.id}
                data-id={letter.id}
                className="letter"
                draggable={true}
                onDragStart={(e) => handleDragStart(e, letter, index)}
              >
                {letter.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrambleGame; 