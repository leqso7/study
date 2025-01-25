const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  const [gameProgress, setGameProgress] = useState({
    puzzleScores: {},
    totalPuzzles: 0,
    totalErrors: 0,
    completedPuzzles: 0,
    completedTasks: [],
    taskScores: {},
    completedScrambleTasks: [],
    scrambleScores: {},
    lastPlayedDate: null
  });

  const updateGameProgress = (type, completedItems, scores) => {
    console.log('Updating progress:', { type, completedItems, scores });
    
    setGameProgress(prev => {
      let newProgress = { ...prev };
      
      if (type === 'task' || type === 'tasks') {
        // ვამოწმებთ არის თუ არა ეს დავალება უკვე დასრულებული
        const itemToAdd = Array.isArray(completedItems) ? completedItems : [completedItems];
        const existingTasks = new Set(prev.completedTasks || []);
        
        // ვამატებთ მხოლოდ ახალ დავალებებს
        itemToAdd.forEach(item => {
          if (!existingTasks.has(item)) {
            existingTasks.add(item);
          }
        });

        newProgress = {
          ...prev,
          completedTasks: Array.from(existingTasks),
          taskScores: {
            ...prev.taskScores,
            ...(typeof scores === 'object' ? scores : { [completedItems]: scores })
          }
        };
      } else if (type === 'scramble') {
        const uniqueScrambleTasks = new Set([
          ...(prev.completedScrambleTasks || []),
          ...(Array.isArray(completedItems) ? completedItems : [completedItems])
        ]);

        newProgress = {
          ...prev,
          completedScrambleTasks: Array.from(uniqueScrambleTasks),
          scrambleScores: {
            ...prev.scrambleScores,
            ...(typeof scores === 'object' ? scores : { [completedItems]: scores })
          }
        };
      } else if (type === 'puzzle') {
        const uniquePuzzles = new Set([
          ...(prev.completedPuzzles || []),
          ...(Array.isArray(completedItems) ? completedItems : [completedItems])
        ]);

        newProgress = {
          ...prev,
          completedPuzzles: Array.from(uniquePuzzles),
          puzzleScores: {
            ...prev.puzzleScores,
            ...(typeof scores === 'object' ? scores : { [completedItems]: scores })
          }
        };
      }
      
      newProgress.lastPlayedDate = new Date().toISOString();
      console.log('Saving progress:', newProgress);
      localStorage.setItem('gameProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  // დავამატოთ localStorage-დან წაკითხვა კომპონენტის მონტაჟისას
  useEffect(() => {
    const savedProgress = localStorage.getItem('gameProgress');
    if (savedProgress) {
      setGameProgress(JSON.parse(savedProgress));
    }
  }, []);

  const value = {
    playerName,
    showNameModal,
    gameProgress,
    updatePlayerName: (name) => {
      setPlayerName(name);
      setShowNameModal(false);
    },
    updateGameProgress
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}; 