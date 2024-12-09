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

  const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('label', "test");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/img/', {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <>
      <Container>
        <Title>Dashboard</Title>
        <Button onClick={handleGetToken} >Get Token</Button>
        <input
          type="file"
          onChange={handleUploadImage}
          style={{ display: 'none' }}
          id="upload-input"
        />
        <Button onClick={() => document.getElementById('upload-input')?.click()} >Upload Image</Button>
        <SimpleGrid cols={3} spacing="lg">
          {images.map((image, index) => (
            <PhotoCard key={index} imageID={image.id} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};
