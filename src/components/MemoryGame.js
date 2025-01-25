import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

const GameContainer = styled.div`
  flex: 1;
  padding: 20px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100vh;
`;

const SetupContainer = styled.div`
  margin: 40px auto;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h1 {
    color: #2c3e50;
    font-size: 2.5em;
    margin-bottom: 30px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: #34495e;
    font-size: 1.5em;
    margin-bottom: 25px;
    font-weight: 500;
  }
`;

const NumberSelect = styled.select`
  padding: 15px 25px;
  margin: 20px;
  font-size: 18px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background-color: white;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  width: 80%;
  max-width: 300px;
  color: #2c3e50;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 15px;

  &:hover {
    border-color: #4CAF50;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
  }

  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
`;

const GameModeToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 30px 0;
  padding: 5px;
  background: #f5f5f5;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const ToggleButton = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.active ? '#4CAF50' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    background-color: ${props => props.active ? '#45a049' : '#e0e0e0'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const StartButton = styled.button`
  padding: 16px 40px;
  margin: 30px;
  font-size: 20px;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  width: 80%;
  max-width: 300px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;

  &:hover {
    background: linear-gradient(45deg, #45a049, #4CAF50);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(76, 175, 80, 0.3);
  }
`;

const GameTitle = styled.h1`
  font-size: 3em;
  color: #2c3e50;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 700;
  letter-spacing: -1px;
  
  span {
    color: #4CAF50;
  }
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 40px auto;
  max-width: 1000px;
  justify-items: center;
  align-items: center;
`;

const ImageCard = styled.div`
  border: 2px solid ${props => props.isSelected ? '#4CAF50' : '#ddd'};
  border-radius: 12px;
  padding: 15px;
  cursor: ${props => props.isPlayable ? 'pointer' : 'not-allowed'};
  transition: all 0.3s ease;
  position: relative;
  width: 250px;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: ${props => props.isPlayable ? 'scale(1.05)' : 'none'};
    box-shadow: ${props => props.isPlayable ? '0 8px 16px rgba(0, 0, 0, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  p {
    margin: 10px 0;
    font-size: 18px;
    font-weight: 500;
    color: #333;
  }

  .order-number {
    position: absolute;
    top: -15px;
    right: -15px;
    width: 35px;
    height: 35px;
    background-color: #4CAF50;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const Timer = styled.div`
  font-size: 32px;
  margin: 30px;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  .hourglass {
    font-size: 36px;
    animation: rotate 2s infinite linear;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.div`
  font-size: 28px;
  margin: 30px;
  color: #333;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const SuccessMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 20px 40px;
  border-radius: 10px;
  font-size: 24px;
  font-weight: bold;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ErrorMessage = styled(SuccessMessage)`
  background-color: rgba(244, 67, 54, 0.9);
`;

const OptionCard = styled(ImageCard)`
  cursor: pointer;
  opacity: ${props => props.disabled ? 0.5 : 1};
  transform: ${props => props.selected ? 'scale(1.02)' : 'none'};
  border-color: ${props => props.selected ? '#4CAF50' : '#ddd'};
  margin: 0;
  min-width: 200px;
  flex: 1;
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.02)'};
    border-color: #4CAF50;
  }

  img {
    height: 150px;
    object-fit: cover;
  }

  p {
    margin: 8px 0;
    font-size: 16px;
  }
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin: 20px auto;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const MemoryGame = () => {
  const [gameState, setGameState] = useState('setup');
  const [numberOfImages, setNumberOfImages] = useState(3);
  const [selectedImages, setSelectedImages] = useState([]);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [timer, setTimer] = useState(5);
  const [userSequence, setUserSequence] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [gameMode, setGameMode] = useState('sequence'); // sequence or missing
  const [missingImage, setMissingImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionImages, setOptionImages] = useState([]);
  const { updateGameProgress } = usePlayer();
  const navigate = useNavigate();

  // ფოტოების ჩატვირთვა
  const loadImages = useCallback(async () => {
    try {
      const images = [
        'ალუბალი.webp', 'არწივი.webp', 'ატამი.webp', 'აქლემი.webp', 'ბანანი.webp',
        'ბროწეული.webp', 'ბუ.webp', 'გველი.webp', 'დათვი.webp', 'დელფინი.webp',
        'ვაშლი.webp', 'ზებრა.webp', 'ზვიგენი.webp', 'ზღარბი.webp', 'თხა (2).webp',
        'ირემი (2).webp', 'კაქტუსი.webp', 'კენგურუ.webp', 'კიტრი.webp', 'კოდალა.webp',
        'კურდღელი.webp', 'ლომი.webp', 'მგელო.webp', 'მელია.webp', 'მზესუმზირა.webp',
        'მსხალი.webp', 'ნაყინი.webp', 'ნიორი.webp', 'ობობა.webp', 'პეპელა.webp',
        'პომიდორი.webp', 'ჟირაფი.webp', 'რკო.webp', 'სიმინდი.webp', 'სპილო.webp',
        'ტიტა.webp', 'ფორთოხალი.webp', 'ქლიავი.webp', 'ყურძენი.webp', 'ხახვი.webp'
      ];

      return images.map(filename => ({
        name: filename.replace('.webp', ''),
        url: `${process.env.PUBLIC_URL}/context/newphotos/${filename}`
      }));
    } catch (error) {
      console.error('Error loading images:', error);
      return [];
    }
  }, []);

  // Fisher-Yates shuffle ალგორითმი
  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      // ვიყენებთ crypto.getRandomValues უფრო ძლიერი შემთხვევითობისთვის
      const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // ვამოწმებთ რომ ახალი მასივი არ იყოს იგივე რაც ორიგინალი ან უკუღმა დალაგებული
    const isReverse = shuffled.every((item, index) => item === array[array.length - 1 - index]);
    const isSame = shuffled.every((item, index) => item === array[index]);
    
    if (isReverse || isSame) {
      // თუ უკუღმა ან იგივე თანმიმდევრობაა, კიდევ ერთხელ ვურევთ
      return shuffleArray(array);
    }
    
    return shuffled;
  }, []);

  // რენდომ ფოტოების არჩევა
  const selectRandomImages = useCallback(async () => {
    const allImages = await loadImages();
    console.log('All images:', allImages);
    const shuffled = shuffleArray(allImages);
    const selected = shuffled.slice(0, numberOfImages);
    console.log('Selected images:', selected);
    setSelectedImages(selected);
    setShuffledImages([...selected]);

    if (gameMode === 'missing') {
      // დამატებითი ფოტოების არჩევა ოფციებისთვის
      const remainingImages = shuffled.slice(numberOfImages, numberOfImages + 3);
      const randomIndex = Math.floor(Math.random() * selected.length);
      const missingImg = selected[randomIndex];
      setMissingImage(missingImg);
      
      // ოფციების შექმნა
      const options = shuffleArray([...remainingImages, missingImg]);
      setOptionImages(options);
    }
  }, [numberOfImages, gameMode]);

  // თამაშის დაწყება
  const startGame = useCallback(async () => {
    await selectRandomImages();
    setGameState('showing');
    setTimer(5);
    setSelectedOption(null);
  }, [selectRandomImages]);

  // მომხმარებლის არჩევანის დამუშავება
  const handleImageClick = useCallback((image, index) => {
    if (gameState !== 'playing') return;

    if (gameMode === 'sequence') {
      setUserSequence(prev => {
        const newSequence = [...prev, { image, index }];
        
        if (newSequence.length === selectedImages.length) {
          const isCorrect = selectedImages.every((img, idx) => 
            newSequence[idx].image.name === img.name
          );
          
          if (isCorrect) {
            updateGameProgress('memory', Date.now(), { score: 100 });
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
              setGameState('setup');
              setUserSequence([]);
            }, 2000);
          } else {
            setShowError(true);
            setTimeout(() => {
              setShowError(false);
              setUserSequence([]);
            }, 2000);
          }
        }
        
        return newSequence;
      });
    }
  }, [gameState, gameMode, selectedImages, updateGameProgress]);

  // ოფციის არჩევა
  const handleOptionSelect = useCallback((image) => {
    if (gameState !== 'playing') return;
    
    setSelectedOption(image);
    const isCorrect = image.name === missingImage.name;
    
    if (isCorrect) {
      updateGameProgress('memory', Date.now(), { score: 100 });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setGameState('setup');
        setSelectedOption(null);
      }, 2000);
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setSelectedOption(null);
      }, 2000);
    }
  }, [gameState, missingImage, updateGameProgress]);

  // ფოტოების არევა
  const shuffleImages = useCallback(() => {
    setShuffledImages(prev => {
      const shuffled = shuffleArray(prev);
      console.log('Original order:', prev.map(img => img.name));
      console.log('Shuffled order:', shuffled.map(img => img.name));
      return shuffled;
    });
    setGameState('playing');
  }, [shuffleArray]);

  // ტაიმერის ლოგიკა
  useEffect(() => {
    let interval;
    
    if ((gameState === 'showing' || gameState === 'memorizing') && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          console.log('Timer tick:', prev - 1);
          return prev - 1;
        });
      }, 1000);

      console.log('Starting timer:', timer, 'State:', gameState);
    } else if (timer === 0) {
      if (gameState === 'showing') {
        console.log('Switching to memorizing');
        setGameState('memorizing');
        setTimer(2);
      } else if (gameState === 'memorizing') {
        console.log('Switching to playing');
        shuffleImages();
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer, gameState, shuffleImages]);

  return (
    <>
      <GameContainer>
        {gameState === 'setup' && (
          <SetupContainer>
            <GameTitle>მეხსიერების თამაში <span>🧠</span></GameTitle>
            <h2>აირჩიე რამდენი სურათი გინდა დაიმახსოვრო:</h2>
            <NumberSelect 
              value={numberOfImages} 
              onChange={(e) => setNumberOfImages(Number(e.target.value))}
            >
              <option value={3}>3 სურათი</option>
              <option value={4}>4 სურათი</option>
              <option value={5}>5 სურათი</option>
            </NumberSelect>
            
            <GameModeToggle>
              <ToggleButton 
                active={gameMode === 'sequence'} 
                onClick={() => setGameMode('sequence')}
              >
                თანმიმდევრობა
              </ToggleButton>
              <ToggleButton 
                active={gameMode === 'missing'} 
                onClick={() => setGameMode('missing')}
              >
                ფოტოს ამოკლება
              </ToggleButton>
            </GameModeToggle>

            <StartButton onClick={startGame}>დაწყება</StartButton>
          </SetupContainer>
        )}

        {showSuccess && (
          <SuccessMessage show>
            გილოცავ! {gameMode === 'sequence' ? 'სწორად გაიხსენე თანმიმდევრობა!' : 'სწორად გამოიცანი რომელი ფოტო აკლდა!'} 🎉
          </SuccessMessage>
        )}

        {showError && (
          <ErrorMessage show>
            სამწუხაროდ {gameMode === 'sequence' ? 'თანმიმდევრობა არასწორია' : 'ვერ გამოიცანი რომელი ფოტო აკლდა'}. სცადე თავიდან! 🤔
          </ErrorMessage>
        )}

        {gameState === 'showing' && (
          <>
            <Timer>
              <span className="hourglass">⌛</span>
              {timer} წამი
            </Timer>
            <Message show>დაიმახსოვრე სურათები!</Message>
            <ImagesGrid>
              {selectedImages.map((image, index) => (
                <ImageCard key={index}>
                  <img src={image.url} alt={image.name} />
                  <p>{image.name}</p>
                </ImageCard>
              ))}
            </ImagesGrid>
          </>
        )}

        {gameState === 'memorizing' && (
          <>
            <Timer>
              <span className="hourglass">⌛</span>
              {timer} წამი
            </Timer>
            <Message show>დახუჭე თვალები! {timer} წამი დარჩა</Message>
          </>
        )}

        {gameState === 'playing' && gameMode === 'sequence' && (
          <>
            <Message show>აღადგინე სურათების თანმიმდევრობა!</Message>
            <ImagesGrid>
              {shuffledImages.map((image, index) => (
                <ImageCard 
                  key={index}
                  isSelected={userSequence.some(seq => seq.index === index)}
                  isPlayable={!userSequence.some(seq => seq.index === index)}
                  onClick={() => !userSequence.some(seq => seq.index === index) && handleImageClick(image, index)}
                >
                  <img src={image.url} alt={image.name} />
                  <p>{image.name}</p>
                  {userSequence.findIndex(seq => seq.index === index) > -1 && (
                    <div className="order-number">
                      {userSequence.findIndex(seq => seq.index === index) + 1}
                    </div>
                  )}
                </ImageCard>
              ))}
            </ImagesGrid>
            <Message show>
              {userSequence.length < selectedImages.length 
                ? `აირჩიე ${userSequence.length + 1}-ე სურათი`
                : 'ყველა სურათი არჩეულია'}
            </Message>
          </>
        )}

        {gameState === 'playing' && gameMode === 'missing' && (
          <>
            <Message show>რომელი ფოტო აკლია?</Message>
            <ImagesGrid>
              {shuffledImages.filter(img => img.name !== missingImage.name).map((image, index) => (
                <ImageCard key={index}>
                  <img src={image.url} alt={image.name} />
                  <p>{image.name}</p>
                </ImageCard>
              ))}
            </ImagesGrid>
            <Message show>აირჩიე სწორი პასუხი:</Message>
            <OptionsGrid>
              {optionImages.map((image, index) => (
                <OptionCard
                  key={index}
                  selected={selectedOption?.name === image.name}
                  onClick={() => handleOptionSelect(image)}
                >
                  <img src={image.url} alt={image.name} />
                  <p>{image.name}</p>
                </OptionCard>
              ))}
            </OptionsGrid>
          </>
        )}
      </GameContainer>
    </>
  );
};

export default MemoryGame;
