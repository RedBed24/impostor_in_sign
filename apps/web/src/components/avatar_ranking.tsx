import { Container, Group, BackgroundImage, Table, Image, Stack, Text, TextInput, Modal, Button, Badge, Tooltip, Popover } from '@mantine/core';
import { useState } from 'react';
import GameState from '../store/game-state';
import { Achievement_Card } from './achievement_card';

interface Avatar_RakingProps {
  position: number;
}

export const Avatar_Raking: React.FC<Avatar_RakingProps> = ({ position }) => {
  const { achieved_v, score, achieved_protector, achieved_top } = GameState();
  const [openedPopover, setOpenedPopover] = useState<number | null>(null);

    const generateRandomNumber = () => {
        return Math.floor(Math.random() * 16) + 1; //[1,16]
    };

    const [imageIndex, setImageIndex] = useState(generateRandomNumber());

    const insignias = [
      { name: '100: Misión Cumplida', achieved: score >= 100, path:'100.png', description: 'Conseguir 100 puntos' },
      { name: 'Maestro de la V', achieved: achieved_v, path: 'gesto.png', description: 'Hacer 10 gestos correctos de la V' },
      { name: 'Protector', achieved: achieved_protector, path:'shield.png', description:'Salvar a 25 personajes seguidos' },
      { name: 'Rescate Relámpago', achieved: false, path:'time.png', description: 'Salvar a 5 personajes en 5 segundos'},
      { name: 'En el Olimpo', achieved: achieved_top , path:'trophy.png', description: 'Entrar en el top 3'},
    ];


    return (
            <Stack h='100%' ml={50}>
                <Text  fz={50} fw={500} c='white' mt={0} mb='xl' ta='center'>#{position}</Text>
                <Image src={`/src/assets/amongus/stickers/${imageIndex}.png`} h='40%' mb='xl'
                fit='contain'/>
        <Group>
          {/* Renderizamos las insignias */}
          {insignias.map((insignia, index) => (
            <Popover key={index} width={150} withArrow shadow="md" opened={openedPopover === index} radius='md'>
              <Popover.Target>
                <Badge
                  size="lg"
                  color={insignia.achieved ? 'green' : 'gray'} 
                  style={{ cursor: 'pointer' }}
                  radius="md"
                  p={0}
                  w={50}
                  h={50}
                  onMouseEnter={() => setOpenedPopover(index)}
                  onMouseLeave={() => setOpenedPopover(null)}
                >
                  <Image
                    src={`/src/assets/badges/${insignia.path}`} 
                    alt={insignia.name}
                    fit='contain'
                    style={{
                      filter: insignia.achieved ? 'none' : 'grayscale(100%)'
                    }}
                  />
                </Badge>
              </Popover.Target>
              <Popover.Dropdown p={2}>
                <Achievement_Card name={insignia.name} description={insignia.description} path={insignia.path} achieved={insignia.achieved}/>
              </Popover.Dropdown>
            </Popover>
          ))}
        </Group>
        </Stack>
    );
};

