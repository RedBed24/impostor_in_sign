import { FC } from 'react';
import { Table, Text } from '@mantine/core';

interface RankingProps {
  users: { name: string, score: number }[];
}

export const Ranking: FC<RankingProps> = ({users}) => {
  return (
    <>
      <Text fz={70} fw={500} variant="gradient"
        gradient={{ from: 'blue', to: 'red', deg: 75 }}>RANKING</Text>
      <Table highlightOnHover withTableBorder bg='gray' opacity='0.8' >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Posición</Table.Th>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Puntuación</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user, index) => (
            <Table.Tr key={index}>
              <Table.Td>{index + 1}</Table.Td>
              <Table.Td>{user.name}</Table.Td>
              <Table.Td>{user.score}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}