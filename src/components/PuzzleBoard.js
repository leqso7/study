import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-height: calc(100vh - 200px);
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 1rem;
  height: fit-content;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2196F3;
`;

const ImageCard = styled(Card)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  position: relative;
  width: calc((100% - ${props => (props.size - 1) * 2}px) / ${props => props.size});
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid rgba(33, 150, 243, 0.2);
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.isExpanded && `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    border: none;
    border-radius: 0;
  `}
`;

const OriginalImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: ${props => props.isExpanded ? 'contain' : `${props.size * 100}% ${props.size * 100}%`};
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.3s ease;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 1fr);
  gap: 2px;
  background-color: ${props => props.isTarget ? 'rgba(245, 245, 245, 0.5)' : 'transparent'};
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 2px dashed ${props => props.isTarget ? 'rgba(33, 150, 243, 0.2)' : 'transparent'};
  aspect-ratio: 1;
`;

const PuzzlePiece = styled.div`
  width: 100%;
  height: 100%;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: ${props => props.size * 100}% ${props => props.size * 100}%;
  background-position: ${props => props.bgPosition};
  border: 2px solid ${props => props.isWrongAttempt ? '#ff4444' : props.isTarget ? 'transparent' : '#e0e0e0'};
  cursor: ${props => props.isPlaced ? 'default' : 'pointer'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    if (props.isWrongAttempt) return 'rgba(255, 68, 68, 0.1)';
    return props.isTarget ? 'rgba(245, 245, 245, 0.5)' : 'transparent';
  }};
  background-repeat: no-repeat;
  position: relative;
  opacity: ${props => props.isDragging ? 0 : 1};
  transform: scale(${props => props.isDragging ? 0.8 : 1});
  border-radius: 0.25rem;
  
  &:hover {
    transform: ${props => props.isPlaced || props.isDragging ? 'none' : 'scale(1.05)'};
    z-index: 1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  background-color: ${props => props.variant === 'primary' ? '#2196F3' : '#4CAF50'};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.variant === 'primary' ? '#1976D2' : '#388E3C'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const Message = styled.div`
  color: #666;
  font-size: 14px;
  text-align: center;
`;

const HintOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(33, 150, 243, 0.9);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  z-index: 2;
`;

const DraggedPiece = styled.div`
  position: fixed;
  width: 100px;
  height: 100px;
  pointer-events: none;
  z-index: 1000;
  border: 2px solid #2196F3;
  background-repeat: no-repeat;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

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

const PuzzleBoard = ({ image, difficulty, onProgress, onComplete, onBackToMenu, onImageChange, onError }) => {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [targetBoard, setTargetBoard] = useState([]);
  const [correctPositions, setCorrectPositions] = useState(new Set());
  const [showHints, setShowHints] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(new Set());
  const [errorCount, setErrorCount] = useState(0);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isToastClosing, setIsToastClosing] = useState(false);

  // Memoize the initial pieces calculation
  const initialPieces = useMemo(() => {
    const totalPieces = difficulty * difficulty;
    const pieceSize = 400 / difficulty;
    const pieces = [];

    for (let i = 0; i < difficulty; i++) {
      for (let j = 0; j < difficulty; j++) {
        pieces.push({
          id: i * difficulty + j,
          bgPosition: `${j * (100 / (difficulty - 1))}% ${i * (100 / (difficulty - 1))}%`,
          correctIndex: i * difficulty + j
        });
      }
    }

    return pieces;
  }, [difficulty]);

  useEffect(() => {
    const initializePuzzle = async () => {
      setIsLoading(true);
      
      try {
        const totalPieces = difficulty * difficulty;
        
        if (!difficulty || difficulty <= 0) {
          console.error('Invalid difficulty value:', difficulty);
          return;
        }

        // Use setTimeout to allow the loading indicator to render
        await new Promise(resolve => setTimeout(resolve, 500));

        const shuffledPieces = [...initialPieces]
          .sort(() => Math.random() - 0.5)
          .map((piece, index) => ({
            ...piece,
            currentPos: index
          }));

        const initialTargetBoard = Array(totalPieces).fill(null);
        
        setPieces(shuffledPieces);
        setTargetBoard(initialTargetBoard);
        setCorrectPositions(new Set());
        setSelectedPiece(null);
        setWrongAttempts(new Set());
        setDraggedPiece(null);
      } catch (error) {
        console.error('Error initializing puzzle pieces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePuzzle();
  }, [image, difficulty, initialPieces]);

  useEffect(() => {
    setShowHints(false);
  }, [difficulty]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedPiece !== null) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [draggedPiece]);

  const handlePaste = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          const reader = new FileReader();
          
          reader.onload = (event) => {
            onImageChange(event.target.result);
            setIsLoading(false);
          };
          
          reader.readAsDataURL(file);
          return;
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error handling paste:', error);
      setIsLoading(false);
    }
  };

  const handleSourcePieceClick = (index) => {
    if (index < 0 || index >= pieces.length || !pieces[index]) {
      console.error('Invalid piece index:', index);
      return;
    }

    if (draggedPiece === index) {
      setDraggedPiece(null);
    } else {
      setDraggedPiece(index);
      setWrongAttempts(new Set());
    }
    setSelectedPiece(index);
  };

  const handleTargetPieceClick = (targetIndex) => {
    if (draggedPiece === null || targetIndex < 0 || targetIndex >= targetBoard.length) {
      return;
    }

    if (targetBoard[targetIndex] !== null) {
      return;
    }

    const selectedPieceData = pieces[draggedPiece];
    if (!selectedPieceData) {
      console.error('Selected piece data is invalid');
      return;
    }

    if (parseInt(selectedPieceData.id) === targetIndex) {
      const newTargetBoard = [...targetBoard];
      newTargetBoard[targetIndex] = selectedPieceData;
      setTargetBoard(newTargetBoard);

      const newPieces = [...pieces];
      newPieces[draggedPiece] = null;
      setPieces(newPieces);

      const newCorrectPositions = new Set(correctPositions);
      newCorrectPositions.add(targetIndex);
      setCorrectPositions(newCorrectPositions);
    } else {
      const newWrongAttempts = new Set(wrongAttempts);
      newWrongAttempts.add(targetIndex);
      setWrongAttempts(newWrongAttempts);
      setErrorCount(prev => prev + 1);
      onError();
    }

    setDraggedPiece(null);
    setSelectedPiece(null);
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const handlePasteClick = () => {
    navigator.clipboard.read().then(async (clipboardItems) => {
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              onImageChange(e.target.result);
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
    }).catch((err) => {
      console.error('Failed to read clipboard:', err);
    });
  };

  const toggleImageExpand = () => {
    setIsImageExpanded(!isImageExpanded);
  };

  useEffect(() => {
    const progress = (correctPositions.size / (difficulty * difficulty)) * 100;
    onProgress(Math.round(progress));
    
    if (correctPositions.size === difficulty * difficulty) {
      onComplete(errorCount);
    }
  }, [correctPositions, difficulty, onComplete, errorCount, onProgress]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <GameContainer>
      <TopSection>
        <Card>
          <CardTitle>
            <span>🎮</span>
            აქ ააწყვე პაზლი
          </CardTitle>
          <div style={{ position: 'relative' }}>
            {isLoading && (
              <LoadingOverlay>
                <LoadingSpinner />
              </LoadingOverlay>
            )}
            <Board size={difficulty} isTarget={true}>
              {targetBoard.map((piece, index) => (
                <PuzzlePiece
                  key={index}
                  image={piece ? image : null}
                  size={difficulty}
                  bgPosition={piece ? piece.bgPosition : ''}
                  isTarget={!piece}
                  isPlaced={piece !== null}
                  isWrongAttempt={wrongAttempts.has(index)}
                  onClick={() => handleTargetPieceClick(index)}
                >
                  {!piece && showHints && (
                    <Message>
                      {index + 1}
                    </Message>
                  )}
                </PuzzlePiece>
              ))}
            </Board>
          </div>
        </Card>

        <RightSection>
          <Card>
            <CardTitle>
              <span>🧩</span>
              პაზლის ნაწილები
            </CardTitle>
            <div style={{ position: 'relative' }}>
              {isLoading && (
                <LoadingOverlay>
                  <LoadingSpinner />
                </LoadingOverlay>
              )}
              <Board size={difficulty} isTarget={false}>
                {pieces.map((piece, index) => piece && (
                  <PuzzlePiece
                    key={piece.id}
                    image={image}
                    size={difficulty}
                    bgPosition={piece.bgPosition}
                    onClick={() => handleSourcePieceClick(index)}
                    isDragging={draggedPiece === index}
                  >
                    {showHints && (
                      <HintOverlay>
                        {parseInt(piece.id) + 1}
                      </HintOverlay>
                    )}
                  </PuzzlePiece>
                ))}
              </Board>
            </div>
          </Card>

          <ImageCard>
            <CardTitle>
              <span>🖼️</span>
              ორიგინალი სურათი
              <span style={{ marginLeft: 'auto', fontSize: '0.8em', opacity: 0.7 }}>
                (დააჭირე გასადიდებლად)
              </span>
            </CardTitle>
            <ImageContainer 
              size={difficulty} 
              isExpanded={isImageExpanded}
              onClick={toggleImageExpand}
            >
              <OriginalImage 
                image={image} 
                size={difficulty}
                isExpanded={isImageExpanded}
              />
            </ImageContainer>
            <ButtonsContainer>
              <Button variant="primary" onClick={toggleHints}>
                {showHints ? '🔍 დამალე მინიშნებები' : '💡 მაჩვენე მინიშნებები'}
              </Button>
              <Button onClick={onBackToMenu}>
                🏠 მთავარ მენიუში დაბრუნება
              </Button>
            </ButtonsContainer>
          </ImageCard>
        </RightSection>
      </TopSection>

      {draggedPiece !== null && pieces[draggedPiece] && (
        <DraggedPiece
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            backgroundImage: `url(${image})`,
            backgroundSize: `${difficulty * 100}% ${difficulty * 100}%`,
            backgroundPosition: pieces[draggedPiece].bgPosition
          }}
        />
      )}
    </GameContainer>
  );
};

export default PuzzleBoard;
