import { Modal, Button, Stack, Pagination, Overlay, Text, Group, Flex, Image, Badge  } from '@mantine/core';
import { useState } from 'react';

interface HelpMenuProps {
  handleClose?: () => void;
}

export const HelpMenu: React.FC<HelpMenuProps> = ({handleClose = () => {}}) => {
  const [tutorialStep, setTutorialStep] = useState(1);
  const [tutorialActive, setTutorialActive] = useState(true);


    const steps = [
        {}, // Empty object to start from 1
        {
          title: "🎉 Primeros pasos en el juego 🎉",
          description:(
            <Flex align='center' gap='md'>
            <Text>
            Este es un tutorial rápido para que aprendas a jugar. Puedes cerrarlo en cualquier momento pulsando en la ❌ de la esquina.</Text>
            <Image m={0} src='/src/assets/amongus/stickers/2.png' h={90} w={90} fit='contain'/>
            </Flex>
            ),
        },
        {
          title: "💠 Modos de juego 💠",
          description: (
            <Text>
              🎓El modo <Badge color='green'>Aprender</Badge> incluye fotos de los gestos para que aprendas mientras juegas.<br/>
              <br/>
              🧠El modo <Badge color='blue'>Memorizar</Badge> no incluye ninguna ayuda y tendrás que usar solo tu memoria.
            </Text>
          ),
        },
        {
          title:  "🎮 Cómo jugar 🎮",
          description:(
            <Flex gap='md' direction='column' align='center'>
            <Text>
            El juego consiste en evitar que el personaje caiga. Para salvarlo tienes que hacer el gesto de la letra que lleva. 
            <Text fw={600}>Recuerda activar la cámara 📸</Text></Text>
            <Image h={100} w={250} src='src/assets/tutorial_estados.png'/>
            </Flex>
          ),
            
        },
        {
          title: "🏆 Logros 🏆",
          description:(
            <Text>
                ¡Consigue todos los logros para ser el mejor!
                ¿Cuáles? Descúbrelo jugando. <br/>
                <Text c='blue' fw={700}>Solo el 10% lo consigue.</Text>
            </Text>
          )
        },
        {
            title: "🥇 Ranking 🥇",
            description:(
              <Text>
                    Compite con tus amigos y otros jugadores para ser el mejor.<br/>
                  ¿Podrás entrar en el top 3?
              </Text>
            )
          },
      ];
    
      const isLastStep = tutorialStep === steps.length - 1;


    return (
        <Overlay  opacity={0.5} color="#000">
        <Modal
          opened={tutorialActive}
          onClose={() => { handleClose(); }}
          title={<Text size="lg" fw={700} >{steps[tutorialStep].title}</Text>}
          centered
          size="md"
        >
          <Stack gap="xl">
            <Text>{steps[tutorialStep].description}</Text>
            {isLastStep && (<Button fullWidth
            onClick={()=> {handleClose();}}>
                A Jugar
            </Button>)}
            <Group justify='center'>
                <Pagination
                    value={tutorialStep}
                    total={steps.length-1}
                    onChange={setTutorialStep}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                />
            </Group>
          </Stack>
        </Modal>
      </Overlay>
    );
};
