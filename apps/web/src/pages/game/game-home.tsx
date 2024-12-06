import { Container, Title, Text, Group, Box, BackgroundImage, Grid, Button, Stack, Image, Skeleton } from '@mantine/core';
import { Link, Route, Switch } from 'wouter';
import { Play, CircleHelp } from 'lucide-react';
import { useState } from 'react';

import GameState from '../../store/game-state';


export const GameHome: React.FC = () => {
  const [isImageLoaded, setImageLoaded] = useState(false);

  const { resetGame } = GameState();

  return (
    <><Container p={0}>
      {!isImageLoaded && (
        <Skeleton
        visible={!isImageLoaded}
        width="100vw"
        height="100vh"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      )}
      <BackgroundImage
        src="/src/assets/pink-moon.jpg"
        onLoad={() => setImageLoaded(true)}
        style={{
          width: '100vw',
          height: '100vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column'
        }}>

        <Stack align="center" justify="center">
          <Group justify='center' style={{ height: 'auto' }}>
            <Image
              src={`/src/assets/among-us-sus.gif`}
              alt={`gif`}
              top={0}
              bottom={0}
              height="15%"
              width="15%"
              m={0}
            />
            <Title c='white' order={1}>IMPOSTOR IN SIGN</Title>
            <Image
              src={`/src/assets/among-us-sus.gif`}
              alt={`gif`}
              top={0}
              bottom={0}
              height="15%"
              width="15%"
              m={0}
            />
          </Group>
          <Link href='/gameplay'>
            <Button size='lg' rightSection={<Play />} onClick={resetGame}>JUGAR</Button>
          </Link>
          <Button size='lg' rightSection={<CircleHelp />}>AYUDA</Button>
        </Stack>
      </BackgroundImage>
    </Container>
    </>
  );
};