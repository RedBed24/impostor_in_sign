import React, { useState, useRef } from 'react';
import { Button, Grid, Flex, Image, Stack, Text, TextInput, SimpleGrid } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { Camera, Upload } from 'lucide-react';
import Webcam from 'react-webcam';

export const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (files: File[]) => {
    const selectedFile = files[0];
    if (selectedFile.type !== 'image/jpeg') {
      setError('Only JPEG files are supported');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const blob = await fetch(imageSrc).then(res => res.blob());
      const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
      setFile(file);
    }
    setImage(imageSrc || null);
  };

  const handleUploadImage = async (event: React.FormEvent) => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      setError('You need to login to upload images');
      return;
    }
    if (!file) {
      setError('No image selected');
      return;
    }
    event.preventDefault();

    console.log('Uploading image:', file, label);

    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('label', label);

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
      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    }
  };

  return (
    <form onSubmit={handleUploadImage}>
      <Stack>
        <Button onClick={() => setWebcamActive(!webcamActive)}>
          <Camera />
          <Text>{webcamActive ? 'Close Webcam' : 'Open Webcam'}</Text>
        </Button>
        {webcamActive ? (
            <>
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={{ maxHeight: 250 }} />
            <Button onClick={capture}>Capture Photo</Button>
            </>
        ) : (
          <Dropzone onDrop={handleDrop} accept={["image/jpeg"]}>
            <Flex align="center" justify="center" style={{ height: 300, border: '2px dotted #ccc' }} direction="column" gap="xs">
              <Upload />
              <Text>Drag images here or click to select files</Text>
            </Flex>
          </Dropzone>
        )}
        {image ? (
          <Image src={image} alt="Uploaded" />
        ) : (
          <Text>No image selected</Text>
        )}
        <TextInput
          label="Label"
          placeholder="Image label"
          required
          value={label}
          onChange={(e) => setLabel(e.currentTarget.value)}
        />
        <Button type="submit">Upload Image</Button>
        {error && <Text c="red">{error}</Text>}
      </Stack>
    </form>
  );
};