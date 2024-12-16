import React, { useEffect, useState } from 'react';
import { Button, Group, Container, Menu, Modal, SimpleGrid, TextInput, Title, ActionIcon } from '@mantine/core';
import { PhotoCard } from './photo-card';
import { LoginForm } from './login-form';
import { ImageUpload } from './image-upload';
import { ChevronDown, Search, Upload, User, X } from 'lucide-react';

interface Image {
  id: string;
  label: string;
}

export const ImageGrid: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loginModalOpened, setLoginModalOpened] = useState<boolean>(false);
  const [uploadModalOpened, setUploadModalOpened] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(9);
  const [skip, setSkip] = useState<number>(0);
  const [searchLabel, setSearchLabel] = useState<string>('');

  const fetchImages = async () => {
    try {
      const response = await fetch(`/api/img?limit=${limit}&skip=${skip}`);
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error('Error getting images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [limit, skip]);

  const handleSearch = async () => {
    if (searchLabel === '') {
      fetchImages();
      return;
    }

    try {
      const response = await fetch(`/api/img/label/${searchLabel}`);
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error('Error getting images:', error);
    }
  };

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
        <Group pt="lg">
          <Title style={{flex: 1}}>Dashboard</Title>
          <Group align='end' >
          <Button onClick={() => setLoginModalOpened(true)} >Login<User /></Button>
          <Button onClick={() => handleUploadImage()} >Upload Image<Upload /></Button>
          </Group>
        </Group>
        <Group p="lg" align='end' >
          <TextInput
            style={{ flex: 1 }}
            label="Search"
            placeholder="Search"
            value={searchLabel}
            onChange={(e) => setSearchLabel(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <ActionIcon onClick={handleSearch} variant='transparent' title="Search"><Search /></ActionIcon>
          <ActionIcon onClick={() => {setSearchLabel(''); fetchImages(); }} variant='transparent' title="Clear"><X /></ActionIcon>
          <Menu>
            <Menu.Target><Button>Images per page<ChevronDown /></Button></Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => setLimit(9)}>9</Menu.Item>
              <Menu.Item onClick={() => setLimit(18)}>18</Menu.Item>
              <Menu.Item onClick={() => setLimit(27)}>27</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <SimpleGrid cols={3} spacing="lg">
          {images.map((image, index) => (
            <PhotoCard key={index} initlabel={image.label} imageID={image.id} getToken={() => setLoginModalOpened(true)} />
          ))}
        </SimpleGrid>
        <Group p="lg" justify='center'>
          <Button onClick={() => setSkip(0)} >First page</Button>
          <Button disabled={skip == 0} onClick={() => setSkip(Math.max(skip - limit, 0))} >Previous page</Button>
          <Button disabled={images.length < limit} onClick={() => {setSkip(skip + limit);}} >Next page</Button>
        </Group>
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
