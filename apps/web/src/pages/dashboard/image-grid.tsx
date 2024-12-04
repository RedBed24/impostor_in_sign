import React, { useEffect, useState } from 'react';
import { Button, Container, SimpleGrid, Title } from '@mantine/core';
import { PhotoCard } from './photo-card';

export const ImageGrid: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleGetToken = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', '');
      formData.append('password', '');

      const response = await fetch('/token', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await response.json();
      console.log("token stored")
      localStorage.setItem('token', data.access_token);
    } catch (error) {
      console.error('Error getting token:', error);
    }
  }

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/img');
        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error('Error getting images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <>
      <Container>
        <Title>Dashboard</Title>
        <Button onClick={handleGetToken} >Get Token</Button>
        <SimpleGrid cols={3} spacing="lg">
          {images.map((image, index) => (
            <PhotoCard key={index} imageID={image.id} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};
