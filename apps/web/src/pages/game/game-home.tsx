import { Container, Title, Text, Group, Box, BackgroundImage, Grid, Button, Stack, Image, Skeleton, Tooltip } from '@mantine/core';
import { Link, Route, Switch } from 'wouter';
import { Play, CircleHelp, House, GraduationCap, Brain } from 'lucide-react';
import { useState } from 'react';
import { HelpMenu } from './help-menu';

import GameState from '../../store/game-state';


export const GameHome: React.FC = () => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const { resetGame, changeModeLearn, changeModeMem } = GameState();

  return (
    <><Container p={0} fluid>
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
          <Group justify='center'>
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
          <Stack>
            <Link href='/gameplay'>
            <Tooltip label='Modo con fotos de los gestos' position='top' color='gray' withArrow>
              <Button size='lg' leftSection={<GraduationCap/>} rightSection={<Play />} onClick={() => { resetGame(); changeModeLearn(); }} color='green' w='100%'>JUGAR Aprender</Button>
            </Tooltip>
            </Link>
            <Link href='/gameplay'>
            <Tooltip label='Modo sin ayudas' position='bottom' color='gray' withArrow>
              <Button size='lg' leftSection={<Brain/>} rightSection={<Play />} onClick={() => { resetGame(); changeModeMem(); }} color='green'>JUGAR Memorizar</Button>
            </Tooltip>
            </Link>
              <Button w='100%' size='lg' rightSection={<CircleHelp />} mt='xl' onClick={() => setHelpOpen(true)}>AYUDA</Button>
              {isHelpOpen && <HelpMenu handleClose={()=> setHelpOpen(false)} />}
              <Tooltip label='Volver al inicio' position='bottom' color='gray' withArrow>
            <Link href='/'>
              <Button w='100%' size='lg' rightSection={<House />}>HOME</Button>
            </Link>
            </Tooltip>
          </Stack>
        </Stack>
      </BackgroundImage>
    </Container>
    </>
  );
};