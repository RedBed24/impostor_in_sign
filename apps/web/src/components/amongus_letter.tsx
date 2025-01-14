import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Image, Stack } from '@mantine/core';
import { useSpring, animated } from '@react-spring/web';
import GameState from '../store/game-state';

interface AmongusLetterProps {
  prediction: string | null;
  speed: number;
  isPaused: boolean;
  color: string | null;
  onLetterGenerated: (letter: string) => void;
}

const AmongusLetter: React.FC<AmongusLetterProps> = ({ prediction, speed, isPaused, color = 'red', onLetterGenerated}) => {
  const [correct, setCorrect] = useState<boolean>(false);
  const [incorrect, setIncorrect] = useState<boolean>(false);
  const [letter, setLetter] = useState<string>('');
  const [background, setBackground] = useState<string>('white');
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [position, setPosition] = useState<number>(-150); // Comienza fuera de la pantalla a la izquierda
  const frameDuration = 100; // Duración de cada frame en ms
  const [verticalPosition, setVerticalPosition] = useState<number>(0); // Posición vertical inicial
  const [movingVertically, setMovingVertically] = useState<boolean>(false); // Control del movimiento vertical
  const containerRef = useRef<HTMLDivElement>(null); // Referencia al contenedor
  const resetCalledRef = useRef(false); // Controla si el reset ya se llamó en este ciclo
  const score = color === 'yellow' ? 5 : 1;

  const generateRandomLetter = useCallback(() => {
    // const letters = 'ABCDEFGHIKLMNOPRSTUVWXYZ';
    const letters = 'ABCDEFGIKLMNORSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setLetter(randomLetter);
    onLetterGenerated(randomLetter);
  }, [onLetterGenerated]);

  useEffect(() => {
    generateRandomLetter();
  }, []); // Solo genera una letra al principio


  const reset = useCallback(() => {
    resetCalledRef.current = false; // Permite que el reset sea llamado en el próximo ciclo
      setCorrect(false);
      generateRandomLetter();
      setMovingVertically(false);
      setVerticalPosition(calculateInitialVerticalPosition());
      setAppliedChange(false);
      setIncorrect(false);
      console.log('reset');
  }, [generateRandomLetter]);

  const [appliedChange, setAppliedChange] = useState<boolean>(false);

  const { loseLife, addScore } = GameState();

  const calculateInitialVerticalPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return rect.top;
    }
    return 0;
  };


  useEffect(() => {
    setVerticalPosition(calculateInitialVerticalPosition());
  }, []);

  // Actualizamos los sprites a intervalos regulares
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex % 12) + 1);
    }, frameDuration);

    return () => clearInterval(interval);
  }, [isPaused]);



  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setPosition((prevPosition) => {

        // Movimiento horizontal
        const newPosition = prevPosition + speed;

        // Iniciar el movimiento vertical en el medio de la pantalla
        if (!incorrect){
          if (newPosition >= window.innerWidth * 0.5 && newPosition <= window.innerWidth * 0.70) {
            setMovingVertically(true);
          } else {
            setMovingVertically(false);
          }
        }

        if (incorrect) {
          if (newPosition >= window.innerWidth * 0.65 && newPosition <= window.innerWidth * 0.9) {
            setMovingVertically(true);
          } else {
            setMovingVertically(false);
          }
        }

        if (movingVertically) {
          const peakX = window.innerWidth * 0.7;
          const height = -300; // Altura máxima de la parábola
          const widthFactor = (window.innerWidth * 0.20);
          if (correct) {
            const parabola = -height * Math.pow((newPosition - peakX) / widthFactor, 2) + height + 20;
            setVerticalPosition(parabola);
          } else {
            setIncorrect(true);
            setBackground('red');
            setVerticalPosition((prev) => prev + 2);
          }
        }

        if ((newPosition > window.innerWidth - 100 || verticalPosition > 200)
          && !resetCalledRef.current) {
          resetCalledRef.current = true;
          if (!appliedChange) {
            loseLife();
            setAppliedChange(true);
        }
          reset();
          return -150; // Vuelve a la izquierda, fuera de la pantalla
        }
        return newPosition;
      });

      if (!isPaused) { // continuar la animación, si está pausado no se ejecuta
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame); // Limpiar el frame al desmontar el componente
  }, [speed, movingVertically, correct, verticalPosition, isPaused, loseLife, reset]);

  // Usar React Spring para animar el movimiento
  const { left, top, rotate } = useSpring({
    left: position,
    top: verticalPosition,
    rotate: background === 'red' && movingVertically ? -90 : 0,
    config: { tension: 170, friction: 26 },
    pause: isPaused,
  });


  // se adivina la letra
  useEffect(() => {
    if (prediction && letter === prediction) {
      if (!appliedChange) { setCorrect(true); addScore(score); setAppliedChange(true); console.log('correct'); }

    } else {
      if (!appliedChange && incorrect) { loseLife(); setAppliedChange(true); console.log('loselife'); }
      
      setBackground('white');
    }
  }, [prediction, letter, appliedChange, incorrect]);

  return (
    <>
      <animated.div
        style={{
          position: 'absolute',
          left: left, 
          top: top, 
          transform: rotate.to((r) => `rotate(${r}deg)`),
          transformOrigin: 'center bottom',
          opacity: position >= 0 ? 1 : 0, // Evita que sea visible cuando está fuera de la pantalla
        }}
      >
        <Stack align="center" w={100} h={100} gap={0}>
          {correct ? <Image
            src={`/src/assets/ballon.png`}
            alt={`ballon`}
            top={0}
            bottom={0}
            height="75%"
            width="10%"
            fit="contain"
            m={0}
          /> : <Box
            pl={10}
            pr={10}
            m ={4}
            bd="2px solid black"
            style={{ background: `${background}` }}
            fz={30}
          >
            {letter}
          </Box>}

            {background === 'red' && movingVertically ? (
            <Image
              src={`/src/assets/amongus/red/idle.png`}
              alt={`Other Image`}
              height="auto"
              width="auto"
              m={0}
            />
            ) : (
            <Image
              src={`/src/assets/amongus/${color}/Walk000${imageIndex}.png`}
              alt={`Letter ${letter}`}
              height="auto"
              width="auto"
              m={0}
            />
            )}
        </Stack>
      </animated.div>
    </>
  );
};

export default AmongusLetter;

