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
            Este es un tutorial rápido para que aprendas a jugar. Puedes cerrarlo en cualquier momento pulsando en la ❌ de la esquina.
            <Image m={0} src='/src/assets/amongus/stickers/2.png' h={90} w={90} fit='contain'/>
            </Flex>
            ),
        },
        {
          title: "💠 Modos de juego 💠",
          description: (
            <Text>
              🎓El modo <Badge color='green' component='span'>Aprender</Badge> incluye fotos de los gestos para que aprendas mientras juegas.<br/>
              <br/>
              🧠El modo <Badge color='blue' component='span'>Memorizar</Badge> no incluye ninguna ayuda y tendrás que usar solo tu memoria.
            </Text>
          ),
        },
        {
          title:  "🎮 Cómo jugar 🎮",
          description:(
            <Flex gap='md' direction='column' align='center'>
            El juego consiste en evitar que el personaje caiga. Para salvarlo tienes que hacer el gesto de la letra que lleva. Un sonido te indicará si lo has hecho bien o mal.<br/>
            <Badge color="red" size="lg">Recuerda activar la cámara 📸</Badge>
            <Image h={100} w={250} src='src/assets/tutorial_estados.png'/>
            </Flex>
          ),
            
        },
        {
          title:  "🎮 Cómo jugar 🎮",
          description:(
            <Flex align='center' gap='md'>
            El personaje amarillo aparece en el nivel 2 y te dará 5 puntos.<br/>
            <Image h={70} w={70} src='src/assets/amongus/yellow/idle.png'/>
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
            {steps[tutorialStep].description}
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
