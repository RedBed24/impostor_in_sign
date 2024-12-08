import { create } from 'zustand'

interface GameState {
  lives: number; // Vidas restantes
  score: number; // Puntuación actual
  level: number; // Nivel del juego

  // Acciones
  loseLife: () => void;
  addScore: (points: number) => void;
  nextLevel: () => void;
  resetGame: () => void;
}

// Crear la tienda con Zustand
const GameState = create<GameState>((set) => ({
  lives: 6,
  score: 0,
  level: 1,
  isPaused: false,

  loseLife: () => set((state) => ({ lives: Math.max(state.lives - 1, 0) })),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  nextLevel: () => set((state) => ({ level: state.level + 1 })),
  resetGame: () =>
    set({
      lives: 6,
      score: 0,
      level: 1,
    }),


}));

export default GameState;
