import React, { useState, useEffect } from 'react';
import { Box, Image, Stack } from '@mantine/core';

interface AmongusLetterProps {
  prediction: string | null;
}

const AmongusLetter: React.FC<AmongusLetterProps> = ({prediction}) => {
  const [letter, setLetter] = useState<string>('');
  const [background, setBackground] = useState<string>('white');
  const [imageIndex, setImageIndex] = useState<number>(0);

  const generateRandomLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setLetter(randomLetter);
  };

  useEffect(() => {
    generateRandomLetter();
  }, []);

  useEffect(() => {
    if (prediction && letter === prediction) {
      setBackground('lightgreen');
      generateRandomLetter();
    }
    else {
      setBackground('white');
    }
  }, [prediction, letter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex % 12) + 1);
    }, 70);

    return () => clearInterval(interval);
  }, []);

  return (
  <>
  <Stack align='center' w={100} h={100} gap ="xs">
    <Box pl={10} pr={10} bd="2px solid black" style={{background: `${background}` }} fz={20}>
      {letter}
    </Box>
    <Image
      src={`/src/assets/amongus/red/Walk000${imageIndex}.png`}
      alt={`Letter ${letter}`}
      height="auto"
      width="auto"
      m = {0} 
    />
  </Stack>
  </> 
  );
};

export default AmongusLetter;