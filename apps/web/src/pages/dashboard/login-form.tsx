import React, { useState } from 'react';
import { TextInput, Group, Button, Box, Text } from '@mantine/core';

interface LoginFormProps {
  setModalOpened: (opened: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({setModalOpened}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('/token', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (!response.ok) {
        setError('Wrong username or password...');
        return;
      }
      const data = await response.json();
      sessionStorage.setItem('token', data.access_token);
      setModalOpened(false);
    } catch (error) {
      console.error('Error getting token:', error);
      setError('Server error, failed to get token...');
    }
  };

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
          mt="md"
        />
        <Group justify="center" mt="md">
          <Button type="submit">
            Submit
          </Button>
        </Group>
        {error && (
          <Group justify="center" mt="md">
            <Text c="red">{error}</Text>
          </Group>
        )}
      </form>
    </Box>
  );
};
