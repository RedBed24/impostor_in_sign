import React, { useEffect, useState } from 'react';
import { Button, Container, Modal, SimpleGrid, Title } from '@mantine/core';
import { PhotoCard } from './photo-card';
import { LoginForm } from './login-form';
import { ImageUpload } from './image-upload';

interface Image {
  id: string;
  label: string;
}

export const ImageGrid: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loginModalOpened, setLoginModalOpened] = useState<boolean>(false);
  const [uploadModalOpened, setUploadModalOpened] = useState<boolean>(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/img?limit=9');
        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error('Error getting images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleUploadImage = () => {
    if (!sessionStorage.getItem('token')) {
      setLoginModalOpened(true);
      return;
    }
    setUploadModalOpened(true);
  };

  return (
    <>
      <Container>
        <Title>Dashboard</Title>
        <Button onClick={() => setLoginModalOpened(true)} >Login</Button>
        <Button onClick={() => handleUploadImage()} >Upload Image</Button>
        <SimpleGrid cols={3} spacing="lg">
          {images.map((image, index) => (
            <PhotoCard key={index} imageID={image.id} getToken={() => setLoginModalOpened(true)} />
          ))}
        </SimpleGrid>
      </Container>
      <Modal opened={loginModalOpened} onClose={() => setLoginModalOpened(false)} size="lg">
        <LoginForm setModalOpened={setLoginModalOpened}/>
      </Modal>
      <Modal opened={uploadModalOpened} onClose={() => setUploadModalOpened(false)} size="lg">
        <ImageUpload />
      </Modal>
    </>
  );
};
