import React, { useEffect, useState } from 'react';
import { ActionIcon, Card, Flex, Group, Image, Modal, Text } from '@mantine/core';
import { Trash2 } from 'lucide-react';

interface PhotoCardProps {
  imageID: string;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ imageID }) => {
  const [label, setLabel] = useState<string>('');
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

  const fetchLabel = async () => {
    try {
      const response = await fetch(`/api/img/${imageID}`);
      const data = await response.json();
      setLabel(data.label);
    } catch (error) {
      console.error('Error fetching label:', error);
    }
  };

  const onRemoveImage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/img/${imageID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Failed to delete image:', data);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  const onImageClick = (url: string) => {
    setSelectedImageUrl(url);
    setModalOpened(true);
  }

  useEffect(() => {
    fetchLabel();
  }, []);

  const imageUrl: string = `/api/img/raw/${imageID}`;

  return (
    <>
      <Card shadow="sm" padding="lg">
        <Card.Section>
          <Image width={200} height={200} onClick={() => { onImageClick(imageUrl) }} src={imageUrl} />
        </Card.Section>
        <Card.Section>
          <Flex justify="space-between" align="center">
            <Text size="lg" mt="md">
              Label: {label}
            </Text>
            <ActionIcon size="sm" variant="transparent" color="red" onClick={onRemoveImage}>
              <Trash2 size={20} />
            </ActionIcon>
          </Flex>
        </Card.Section>
      </Card>
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} size="lg">
        <Image src={selectedImageUrl} />
      </Modal>
    </>
  );
};
