import { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import GameState from '../store/game-state';

interface LevelUpProps {
    onComplete: () => void;
}

export const LevelUp: React.FC<LevelUpProps> = ({onComplete}) => {
  const [show, setShow] = useState(true);
  const {level} = GameState();

  const props = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' }, // Estado inicial: invisible y pequeño
    to: { opacity: 1, transform: 'scale(1)' }, // Estado final: visible y tamaño normal
    config: { tension: 100, friction: 30 }, // Configuración física
    onRest: () => {
      setShow(false); // Oculta el mensaje después de la animación
      onComplete?.(); // Llama al callback si está definido
    },
  });

  useEffect(() => {
    setShow(true); 
  }, []); 

  return show ? (
    <animated.div
      style={{
        ...props,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '4em',
        zIndex: 999,
      }}
      key={level}
    >
      <span style={{ fontWeight: 'bold', fontSize: '5em', padding: 4 }}>{level}</span>
      LEVEL UP!
    </animated.div>
  ) : null;
};
