import { Link, Route, Switch } from 'wouter';
import { Button, Container } from '@mantine/core';
import { GameHome } from './pages/game/game-home';

export const App: React.FC = () => {

  return (
    <>
      <Container p={0} m={0}>
        <Link href='/game'>
          <Button>Go to Game</Button>
        </Link>
        <Link href='/dashboard'>
          <Button>Dashboard</Button>
        </Link>

        <Switch>
          <Route path="/game" component={GameHome} />
          <Route path="/dasboard" />
        </Switch>
      </Container>
    </>
  );
};
