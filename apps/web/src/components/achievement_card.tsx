import { Image, Text, Badge, Card, Title,  } from '@mantine/core';

interface Achievement_CardProps {
    name: string;
    description: string;
    path: string;
    achieved: boolean;
}

export const Achievement_Card: React.FC<Achievement_CardProps> = ({name, description, path, achieved}) => {
    return (
        <Card shadow='sm' radius='md' >
            <Card.Section bg='black'>
                <Image src={`/src/assets/badges/${path}`} alt={name} fit='contain' />
            </Card.Section>
            <Card.Section>                
                <Title order={3} fw={500}>{name}</Title>
                <Text size='sm'>{description}</Text>
                <Badge color={achieved ? 'green' : 'gray'}>{achieved ? 'Conseguido' : 'No conseguido'}</Badge>
            </Card.Section>
        </Card>
    );
};

