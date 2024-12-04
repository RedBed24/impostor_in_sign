import { Link, Route, Switch } from 'wouter';
import { Button, Container } from '@mantine/core';
import { GameHome } from './pages/game/game-home';
import { ImageGrid } from './pages/dashboard/image-grid';

export const App: React.FC = () => {

  return (
    <>
      <Container>
        <Link href='/game'>
          <Button>Go to Game</Button>
        </Link>
        <Link href='/dashboard'>
          <Button>Dashboard</Button>
        </Link>

        <Switch>
          <Route path="/game" component={GameHome} />
          <Route path="/dashboard" component={ImageGrid} />
        </Switch>
      </Container>
    </>
  );
};
