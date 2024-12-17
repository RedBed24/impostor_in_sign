import { Route, Switch } from 'wouter';
import { Container } from '@mantine/core';
import { GameHome } from './pages/game/game-home';
import { GamePlay } from './pages/game/game-play';
import { ImageGrid } from './pages/dashboard/image-grid';
import { Home } from './pages/home';

export const App: React.FC = () => {

  return (
    <>
    <Container size="xl" py="xl" bg='gray.2' m={0} fluid>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/game" component={GameHome}/>
          <Route path="/dashboard" component={ImageGrid} />
          <Route path="/gameplay" component={GamePlay} />
        </Switch>
    </Container>
    </>
  );
};
