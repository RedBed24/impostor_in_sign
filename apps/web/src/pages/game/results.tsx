import { Container, Group, BackgroundImage, Table, Stack, Text, TextInput, Modal, Button } from '@mantine/core';
import { House, SendHorizontal } from 'lucide-react';
import { useEffect, useState } from "react";
import Confetti from 'react-confetti';
import GameState from '../../store/game-state';
import { Avatar_Raking } from '../../components/avatar_ranking';
import { Link } from 'wouter';

export const Results: React.FC = () => {
  const [opened, setOpened] = useState(true);
  const [name, setName] = useState("");
  const [position, setPosition] = useState(-1);

  const { score } = GameState();

  const handleClose = () => {
    if (name.trim() !== "") {
      setOpened(false);
    }
  };
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
  };
  useEffect(() => {
    setPosition(generateRandomNumber());
  }, []);

  return (
    <>
      <Container p={0}>
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
              <Text fz={70} fw={500} variant="gradient"
                gradient={{ from: 'blue', to: 'red', deg: 75 }}>RANKING</Text>
              <Table highlightOnHover withTableBorder bg='gray' opacity='0.8' >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Posición</Table.Th>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Puntuación</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>0</Table.Td>
                    <Table.Td>Red Sus</Table.Td>
                    <Table.Td>90</Table.Td>
                  </Table.Tr>
                <Table.Tr>
                    <Table.Td>{position}</Table.Td>
                    <Table.Td>{name}</Table.Td>
                    <Table.Td>{score}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
                {/* <Table.Tbody>{rows}</Table.Tbody> */}
              </Table>
            </Stack>
          </Group>
        </BackgroundImage>
      </Container>
    </>
  );
};
