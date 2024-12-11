import React, { useEffect, useState } from 'react';
import { Button, Container, Modal, SimpleGrid, Title } from '@mantine/core';
import { PhotoCard } from './photo-card';
import { LoginForm } from './login-form';

export const ImageGrid: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [modalOpened, setModalOpened] = useState<boolean>(false);

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
    const token = sessionStorage.getItem('token');

    if (!token) {
      setModalOpened(true);
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('label', "test");

    try {
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
        <Button onClick={() => setModalOpened(true)} >Login</Button>
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
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} size="lg">
        <LoginForm setModalOpened={setModalOpened}/>
      </Modal>
    </>
  );
};
