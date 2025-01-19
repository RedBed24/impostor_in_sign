import { Container, Group, BackgroundImage, Table, Stack, Text, TextInput, Modal, Button } from '@mantine/core';
import { House, SendHorizontal } from 'lucide-react';
import { useEffect, useState } from "react";
import Confetti from 'react-confetti';
import GameState from '../../store/game-state';
import { Avatar_Raking } from '../../components/avatar_ranking';
import { Link } from 'wouter';
import { Ranking } from '../../components/ranking';

export const Results: React.FC = () => {
  const [opened, setOpened] = useState(true);
  const [name, setName] = useState("");
  const [position, setPosition] = useState(-1);

  const { score } = GameState();

  interface user {
    name: string;
    score: number;
  }
  const users: user[] = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users') || "") : []

  const handleClose = () => {
    if (name.trim() !== "") {
      setOpened(false);
      const positionl = users.findIndex((user) => user.score < score);
      setPosition(positionl === -1 ? users.length : positionl + 1);
      users.splice(positionl === -1 ? users.length : positionl, 0, { name: name, score: score });
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <>
      <Container p={0} fluid>
        <BackgroundImage
          src="/src/assets/dotted_background.jpg"
          style={{
            width: '100vw',
            height: '100vh',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            flexDirection: 'column'
          }}>
          <Modal opened={opened}
            onClose={handleClose}
            title="NUEVO RECORD" centered
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 1,
            }}>
            <Stack>
              <TextInput label="Nombre"
                description="Este nombre se mostrará en el ranking"
                withAsterisk
                placeholder="Escribe tu nombre"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                error={name.trim() === "" ? "Por favor, introduce tu nombre" : null}
              />
              <Button rightSection={<SendHorizontal />} onClick={handleClose}>OK</Button>
            </Stack>
          </Modal>


          {position <= 20 && !opened && (<Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />)}
          <Group style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            h='100%'>
            <Avatar_Raking position={position} />
            <Stack w='50%' m={50} h='100%' >
            <Group style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link href='/game'>
              <Button size='xl' rightSection={<House />}>HOME</Button>
              </Link>
            </Group>
            <Ranking users={users.slice(0, 9)} /> {/*.sort((a, b) => b.score - a.score)*/}
            </Stack>
          </Group>
        </BackgroundImage>
      </Container>
    </>
  );
};
