import { Button, Container, Group, Text, Title } from '@mantine/core';
import { Link } from 'wouter';


export function NotFound() {
  return (
    <Container fluid m={0} h='100vh'>
      <div style={{
        fontSize: 58,
        fontWeight: 900,
        textAlign: 'center',
        color: '#FF1744', paddingTop: 100,
        paddingBottom: 50
      }}>404</div>
      <Title fw={900} fz={38} ta='center'>You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" m='auto' maw={500}>
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
        been moved to another URL.
      </Text>
      <Group justify="center" mt={30}>
        <Link href='/'>
        <Button variant="subtle" size="md">
          Take me back to home page
        </Button>
        </Link>
      </Group>
    </Container>
  );
}