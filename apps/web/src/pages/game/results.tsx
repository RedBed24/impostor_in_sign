import { Container, Group, BackgroundImage, Table, Image, Stack, Text, TextInput, Modal, Button } from '@mantine/core';
import { SendHorizontal } from 'lucide-react';
import { useState } from "react";
import Confetti from 'react-confetti';
import GameState from '../../store/game-state';

export const Results: React.FC = () => {
  const [opened, setOpened] = useState(true);
  const [name, setName] = useState("");

  const { score } = GameState();

  const handleClose = () => {
    if (name.trim() !== "") {
      setOpened(false);
    }
  };
  const generateRandomNumber = () => {
    // Genera un número aleatorio entre 1 y 16
    return Math.floor(Math.random() * 16) + 1;
  };

  const [imageIndex, setImageIndex] = useState(generateRandomNumber());


  return (
    <>
      <Container p={0}>
        <BackgroundImage
          src="/src/assets/dotted_background.jpg"
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


          {imageIndex <= 20 && !opened && (<Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />)}
          <Group style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            h='100%'>
            <Stack align="center" justify="center" h='100%' ml={40}>
              <Text fz={70} fw={500} c='white' >#{imageIndex}</Text>
              <Image src={`/src/assets/amongus/stickers/${imageIndex}.png`} h='40%' />
            </Stack>
            <Stack w='50%' m={50} >
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
                </Table.Tbody>
                <Table.Tr>
                    <Table.Td>{imageIndex}</Table.Td>
                    <Table.Td>{name}</Table.Td>
                    <Table.Td>{score}</Table.Td>
                  </Table.Tr>
                {/* <Table.Tbody>{rows}</Table.Tbody> */}
              </Table>
            </Stack>
          </Group>
        </BackgroundImage>
      </Container>
    </>
  );
};
