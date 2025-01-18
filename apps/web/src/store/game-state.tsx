import { create } from 'zustand'

interface GameState {
  lives: number; // Vidas restantes
  score: number; // Puntuación actual
  level: number; // Nivel del juego
  mode: 'learn' | 'memorize'; // Modo de juego
  count_v: number; // Contador de gestos V correctos
  achieved_v: boolean; // numero para conseguir el logro de la V

  // Acciones
  loseLife: () => void;
  addScore: (points: number) => void;
  nextLevel: () => void;
  resetGame: () => void;
  changeModeLearn: () => void;
  changeModeMem: () => void;
  addCount_v: () => void;
}

const GameState = create<GameState>((set) => ({
  lives: 3,
  score: 0,
  level: 1,
  mode: 'learn',
  count_v: 0,
  achieved_v: false,

  changeModeLearn: () => set(() => {
    console.log('changeModeLearn');
    return { mode: 'learn' };
  }),

  changeModeMem: () => set(() => {
    console.log('changeModeMem');
    return { mode: 'memorize' };
  }),
  
  loseLife: () => set((state) => {
    const newLives = Math.max(state.lives - 1, 0);
    console.log('loseLife:', newLives);
    return { lives: newLives };
  }),
  
  addScore: (points) => set((state) => {
    const newScore = state.score + points;
    console.log('addScore:', newScore);
    return { score: newScore };
  }),
  
  nextLevel: () => set((state) => {
    const newLevel = state.level + 1;
    console.log('nextLevel:', newLevel);
    return { level: newLevel };
    }),
    
    addCount_v: () => set((state) => {
    const newCount_v = state.count_v + 1;
    const achieved_v = newCount_v >= 10;
    console.log('count_v:', newCount_v, 'achieved_v:', achieved_v);
    return { count_v: newCount_v, achieved_v };
    }),

    resetGame: () => set(() => {
    console.log('resetGame');
    return {
      lives: 3,
      score: 0,
      level: 1,
      count_v: 0,
    };
  }),
}));

export default GameState;
