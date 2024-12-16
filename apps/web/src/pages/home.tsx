import { Container, Title, Text, Button, Grid, Card, Image, Badge, Group, Flex, Box, Anchor} from '@mantine/core';
import {Gamepad, GraduationCap, Trophy} from 'lucide-react';
import { Author } from '../components/author';

export const Home: React.FC = () => {

    return ( 
      <Container size="xl" py="xl" bg='gray.2' m={0} fluid>
        <Title order={1} ta="center" mb="md" size={50} variant='gradient' c='blue'>
          IMPOSTOR IN SIGN
        </Title>
        
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          align="center" 
          justify="space-between" 
          mb="xl"
          style={{border: '1px solid #eaeaea', borderRadius: '8px'}}
          p={{ base: 'md', md: 'sm' }}
        
        >
          <Box>
        <Text fz={40}>
          ¡Aprende la Lengua de Señas de forma divertida!
        </Text>
        <Text ta="center" size='lg' mt="md">
          Explora nuestra plataforma que combina el aprendizaje de lenguaje de señas con un divertido juego inspirado en Among Us.
        </Text>
        <Group justify="center" mt="xl">
          <Anchor href='/game' target='_blank' rel="noopener noreferrer">
          <Button size="xl">
        JUGAR
          </Button>
          </Anchor>
        </Group>
          </Box>

          <Image 
        src="/src/assets/hello_hand.jpg" 
        alt="Imagen descriptiva" 
        fit='contain'
        height={500}
        radius='md'
          />
        </Flex>
      
        <Card mt="xl" shadow="sm" radius="md" withBorder mb="xl">
          <Title order={2} ta="center" mb="md">
        JUEGO
          </Title>
        <Grid gutter="xl" mb="xl" h='400px' style={{ backgroundImage: 'url(/src/assets/amongus_space.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <Grid.Col span={{ base: 12, md: 4 }} >
        <Card 
          padding="lg" 
          radius="md"
          h = "100%"
          bg='transparent' 
        >
          <Card.Section>
            <Group mt="md" justify="center">
          <Gamepad size={70}  color='white' strokeWidth={1.5}/>
            </Group>
          </Card.Section>
          
          <Box style={{ 
            backgroundColor: 'rgba(0,0,0,0.6)',  
            borderRadius: '8px' 
          }}>
            <Title order={3} ta="center" mt="md" mb="xs" c="white">
          Interacción
            </Title>
            <Text ta="center" size="sm" c="gray.2">
          Olvídate de libros y videos aburridos para aprender la lengua de signos.
            </Text>
          </Box>
        </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
        <Card 
          
          padding="lg" 
          radius="md" 
          h='100%'
          bg='transparent' 
        >
          <Card.Section>
            <Group justify="center" mt="md">
          <GraduationCap size={70} color='white' strokeWidth={1.5}/>
            </Group>
          </Card.Section>
          
          <Box style={{ 
            backgroundColor: 'rgba(0,0,0,0.6)', 
            padding: '15px', 
            borderRadius: '8px' 
          }}>
            
            <Title order={3} ta="center" mt="md" mb="xs" c="white">
          Aprendizaje
            </Title>
            <Text ta="center" size="sm" c="gray.2">
          Hay diferentes modos: memorización y aprendizaje
            </Text>
          </Box>
        </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
        <Card 
         padding="lg" 
         radius="md" 
          h='100%'
          bg='transparent' 
        >
          <Card.Section>
            <Group justify="center" mt="md">
          <Trophy size={70} color ='white' strokeWidth={1.5}/>
            </Group>
          </Card.Section>
          
          <Box style={{ 
            backgroundColor: 'rgba(0,0,0,0.6)', 
            padding: '15px', 
            borderRadius: '8px' 
          }}>
            <Title order={3} ta="center" mt="md" mb="xs" c="white">
          Competición
            </Title>
            <Text ta="center" size="sm" c="gray.2">
          Juega para desbloquear logros y ser el primero en el ranking.
            </Text>
          </Box>
        </Card>
          </Grid.Col>
        </Grid>
        </Card>
        
        <Card mt="xl" shadow="sm" radius="md" withBorder mb="xl">
          <Title order={2} ta="center" mb="xl">
        API: Operaciones CRUD de Imágenes
          </Title>
          
          <Grid h={200} mt='xl' gutter='xl'>
        <Grid.Col span={{ base: 4, md: 3 }} mb='xl'>
          <Badge fullWidth color="green" size='25' p='30'>GET</Badge>
          <Text ta="center" size='xl'>Obtener imágenes existentes</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 4, md: 3 }}>
          <Badge fullWidth color="red" size='25' p='30'>DELETE</Badge>
          <Text ta="center" size='xl'>Eliminar imágenes</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 4, md: 3 }}>
          <Badge fullWidth color="yellow" size='25' p='30'>UPDATE</Badge>
          <Text ta="center" size='xl'>Modificar la etiqueta</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 4, md: 3 }}>
          <Badge fullWidth color='violet' size='25' p='30'>POST</Badge>
          <Text ta="center" size='xl'>Cargar nuevas imágenes</Text>
        </Grid.Col>
          </Grid>
          <Anchor href='/dashboard' target='_blank' rel="noopener noreferrer">
          <Button fullWidth size='xl'>IR A LA API</Button>
          </Anchor>
        </Card>
        
        {/* Sección de Autores */}
        <Card shadow="xl" radius="md" withBorder >
          <Title order={2} ta="center" mb="md">
        Autores
          </Title>
          <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="center" 
        align="center" 
        gap="xl"
          >
        <Author username='elena-17' />
        <Author username='redBed24' />
          </Flex>
        </Card>
      </Container>
    );
};
