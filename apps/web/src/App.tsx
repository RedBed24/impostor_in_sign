import { Route, Switch } from 'wouter';
import { Container } from '@mantine/core';
import { GameHome } from './pages/game/game-home';
import { GamePlay } from './pages/game/game-play';
import { ImageGrid } from './pages/dashboard/image-grid';
import { Home } from './pages/home';
import { NotFound } from './pages/not-found';

export const App: React.FC = () => {

  return (
    <>
    <Container size="xl" bg='gray.2' m={0} fluid p={0}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/game" component={GameHome}/>
          <Route path="/dashboard" component={ImageGrid} />
          <Route path="/gameplay" component={GamePlay} />
          <Route component={NotFound}></Route>
        </Switch>
    </Container>
    </>
  );
};
