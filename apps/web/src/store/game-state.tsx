import { create } from 'zustand'

interface GameState {
  lives: number; // Vidas restantes
  score: number; // Puntuación actual
  level: number; // Nivel del juego
  mode: 'learn' | 'memorize'; // Modo de juego
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
  amongusDied: () => void;
}

const GameState = create<GameState>((set) => ({
  lives: 3,
  score: 0,
  level: 1,
  mode: 'learn',
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
  resetGame: () => set(() => {
    console.log('resetGame');
    return {
      lives: 3,
      score: 0,
      level: 1,
      gameover: false,
    };
  }),
}));

export default GameState;
