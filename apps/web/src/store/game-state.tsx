import { create } from 'zustand'

interface GameState {
  lives: number; // Vidas restantes
  score: number; // Puntuación actual
  level: number; // Nivel del juego
  mode: 'learn' | 'memorize'; // Modo de juego
  count_v: number; // Contador de gestos V correctos
  achieved_v: boolean; // numero para conseguir el logro de la V
  combo: number; // Contador de combos, con un fallo se reinicia
  achieved_protector: boolean; // logro de combo
  achieved_top: boolean; // top3
  scoreToLevel: number; // Cada X puntos se sube de nivel
  yellowEvent: [number, number]; // Evento amarillo, [nivel inicio, nivel fin]
  gameover: boolean; // Juego terminado

  // Acciones
  loseLife: () => void;
  addScore: (points: number) => void;
  nextLevel: () => void;
  resetGame: () => void;
  changeModeLearn: () => void;
  changeModeMem: () => void;
  addCount_v: () => void;
  amongusDied: () => void;
  achieveTop: () => void;
}

const GameState = create<GameState>((set) => ({
  lives: 3,
  score: 0,
  level: 1,
  mode: 'learn',
  count_v: 0,
  achieved_v: false,
  combo: 0,
  achieved_protector: false,
  achieved_top: false,
  scoreToLevel: 10,
  yellowEvent: [2, 5],
  gameover: false,

  amongusDied: () => set((state) => {
    if (state.lives === 0) {
      console.log('gameover');
      return { gameover: true };
    }
    return {};
  }),
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
    return { lives: newLives, combo: 0 };
  }),
  
  addScore: (points) => set((state) => {
    const newScore = state.score + points;
    const newCombo = state.combo + 1; // no es points porque puede que points != 1
    const achieved_protector = newCombo >= 25;
    console.log('addScore:', newScore, 'combo:', newCombo);
    return { score: newScore, combo: newCombo, achieved_protector };
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

  achieveTop: () => set(() => {
    console.log('achieveTop');
    return { achieved_top: true };
  }),

    resetGame: () => set(() => {
    console.log('resetGame');
    return {
      lives: 3,
      score: 0,
      level: 1,
      count_v: 0,
      achieved_v: false,
      combo: 0,
      achieved_protector: false,
      achieved_top: false,
      gameover: false,
    };
  }),
}));

export default GameState;
