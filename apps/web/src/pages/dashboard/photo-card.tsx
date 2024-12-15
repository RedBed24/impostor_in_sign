import React, { useState } from 'react';
import { ActionIcon, Card, Flex, Image, Modal, Text, TextInput } from '@mantine/core';
import { Check, Pencil, Trash2 } from 'lucide-react';

interface PhotoCardProps {
  imageID: string;
  initlabel: string;
  getToken: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ imageID, initlabel, getToken }) => {
  const [label, setLabel] = useState<string>(initlabel);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const onRemoveImage = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      getToken();
      return;
    }

    try {
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

  const onEditLabel = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      getToken();
      return;
    }

    try {
      const response = await fetch(`/api/img/${imageID}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsEditable(false);
      } else {
        console.error('Failed to update label:', data);
      }
    }
    catch (error) {
      console.error('Error updating label:', error);
    }
  };

  const imageUrl: string = `/api/img/raw/${imageID}`;

  return (
    <>
      <Card shadow="sm" padding="lg">
        <Card.Section>
          <Image width={200} height={200} onClick={() => { setModalOpened(true) }} src={imageUrl} />
        </Card.Section>
        <Card.Section>
          <Flex justify="space-between" align="center">
            <Flex gap="xs" align="center">
              <Text>Label:</Text>
              {isEditable ? (
              <>
              <TextInput value={label} onChange={(e) => setLabel(e.currentTarget.value)} />
              <ActionIcon size="sm" variant="transparent" color="green" onClick={() => {setIsEditable(!isEditable); onEditLabel();}}>
                <Check size={20} />
              </ActionIcon>
              </>
              ) : (
              <>
              <Text onClick={() => setIsEditable(!isEditable)}>{label}</Text>
              <ActionIcon size="sm" variant="transparent" color="green" onClick={() => setIsEditable(!isEditable)}>
                <Pencil size={20} />
              </ActionIcon>
              </>
              )}
            </Flex>
            <ActionIcon size="sm" variant="transparent" color="red" onClick={onRemoveImage}>
              <Trash2 size={20} />
            </ActionIcon>
          </Flex>
        </Card.Section>
      </Card>
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} size="lg">
        <Image src={imageUrl} />
      </Modal>
    </>
  );
};
