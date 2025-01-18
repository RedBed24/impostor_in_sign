import { Container, Group, BackgroundImage, Table, Image, Stack, Text, TextInput, Modal, Button, Badge, Tooltip } from '@mantine/core';
import { useState } from 'react';
import GameState from '../store/game-state';

interface Avatar_RakingProps {
    position: number;
}

export const Avatar_Raking: React.FC<Avatar_RakingProps> = ({ position }) => {
  const { achieved_v, score, achieved_protector } = GameState();
    const generateRandomNumber = () => {
        return Math.floor(Math.random() * 16) + 1; //[1,16]
    };

    const [imageIndex, setImageIndex] = useState(generateRandomNumber());

    const insignias = [
      { name: '100: Misión Cumplida', achieved: score >= 100, path:'100.png' },
      { name: 'Maestro de la V', achieved: achieved_v, path: 'gesto.png' },
      { name: 'Protector', achieved: achieved_protector, path:'shield.png' },
      { name: 'Rescate Relámpago', achieved: false, path:'time.png' },
      { name: 'En el Olimpo', achieved: false , path:'trophy.png' },
    ];


    return (
            <Stack h='100%' ml={50}>
                <Text  fz={50} fw={500} c='white' mt={0} mb='xl' ta='center'>#{position}</Text>
                <Image src={`/src/assets/amongus/stickers/${imageIndex}.png`} h='40%' mb='xl'
                fit='contain'/>
            <Group>
          {/* Renderizamos las insignias */}
          {insignias.map((insignia, index) => (
            <Tooltip
              key={index}
              label={insignia.name}
              position="top"
              withArrow
            >
              <Badge
                size="lg"
                color={insignia.achieved ? 'green' : 'gray'} 
                style={{ cursor: 'pointer' }}
                radius="md"
                p={0}
                w={50}
                h={50}
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
            </Tooltip>
          ))}
            </Group>
        </Stack>
    );
};

