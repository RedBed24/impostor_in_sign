import React, { useState, useEffect, useRef } from 'react';
import { Box, Image, Stack } from '@mantine/core';
import { useSpring, animated } from '@react-spring/web';

interface AmongusLetterProps {
  prediction: string | null;
  speed: number;
  isPaused: boolean;
}

const AmongusLetter: React.FC<AmongusLetterProps> = ({ prediction, speed, isPaused }) => {
  const [correct, setCorrect] = useState<boolean>(false);
  const [letter, setLetter] = useState<string>('');
  const [background, setBackground] = useState<string>('white');
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [position, setPosition] = useState<number>(-150); // Comienza fuera de la pantalla a la izquierda
  const frameDuration = 100; // Duración de cada frame en ms
  const [verticalPosition, setVerticalPosition] = useState<number>(0); // Posición vertical inicial
  const [movingVertically, setMovingVertically] = useState<boolean>(false); // Control del movimiento vertical
  const containerRef = useRef<HTMLDivElement>(null); // Referencia al contenedor


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

    const reset = () => {
      setCorrect(false);
      generateRandomLetter();
      setMovingVertically(false);
      setVerticalPosition(calculateInitialVerticalPosition());
    };

    const animate = () => {
      setPosition((prevPosition) => {

        // Movimiento horizontal
        const newPosition = prevPosition + speed;

        // Iniciar el movimiento vertical en el medio de la pantalla
        if (newPosition >= window.innerWidth * 0.5 && newPosition <= window.innerWidth * 0.70) {
          setMovingVertically(true);
        } else {
          setMovingVertically(false);
        }

        // Calcular posición vertical como una parábola
        if (movingVertically) {
          const peakX = window.innerWidth * 0.7;
          const height = -300; // Altura máxima de la parábola
          const widthFactor = (window.innerWidth * 0.20);
          if (correct) {
            const parabola = -height * Math.pow((newPosition - peakX) / widthFactor, 2) + height + 20;
            setVerticalPosition(parabola);
          } else {
            console.log(verticalPosition);
            setBackground('red');
            const straight = verticalPosition + speed;
            setVerticalPosition(straight);
          }
        }


        if (newPosition > window.innerWidth - 100 || verticalPosition > 120) {
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
  }, [speed, movingVertically, correct, verticalPosition, isPaused]);

  // Usar React Spring para animar el movimiento
  const { left } = useSpring({
    left: position,
    top: verticalPosition,
    config: { tension: 170, friction: 26 },
    pause: isPaused,
  });

  // Generar una letra aleatoria
  const generateRandomLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setLetter(randomLetter);
  };



  useEffect(() => {
    generateRandomLetter();
  }, []); // Solo genera una letra al principio

  // Cambiar el fondo cuando se adivina la letra
  useEffect(() => {
    if (prediction && letter === prediction) {
      setCorrect(true);
      setBackground('lightgreen');
      generateRandomLetter(); 
    } else {
      setBackground('white');
    }
  }, [prediction, letter]);

  return (
    <>
      <animated.div
        style={{
          position: 'absolute',
          left: left, // Movimiento animado del personaje
          top: verticalPosition, // Movimiento vertical controlado
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

          {background === 'red' ? (
            <Image
            src={`/src/assets/amongus/red/idle.png`}
            alt={`Other Image`}
            height="auto"
            width="auto"
            m={0}
          />
          ) : (
            <Image
              src={`/src/assets/amongus/red/Walk000${imageIndex}.png`}
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
