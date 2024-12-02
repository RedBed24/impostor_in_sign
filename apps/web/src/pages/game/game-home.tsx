import { Container, Title, Text, Group, Box, BackgroundImage, Grid, Button } from '@mantine/core';
import { Pause, Play } from 'lucide-react';

import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react";
import AmongusLetter from '../../components/amongus_letter';

const videoConstraints = {
  width: 200,
  height: 200,
  facingMode: "user"
};

export const GameHome: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isCameraReady, setCameraReady] = useState(false);
  
  //test
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPrediction(event.key.toUpperCase());
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const handleUserMedia = () => {
    console.log("Cámara lista");
    setCameraReady(false);
  };

  useEffect(() => {
    if (!isCameraReady) return;

    let running = true;

    const captureAndSendFrame = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); //cambia demasiado
      if (!running || !webcamRef.current) return;

      // Capturar la imagen de la cámara como una base64
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        console.error("No se pudo capturar una imagen desde la cámara.");
      }
      if (imageSrc) {
        const formData = new FormData();
        formData.append('file', dataURItoBlob(imageSrc), 'screenshot.jpg');
        try {
          console.log('Enviando al backend...');
          // Enviar al backend
          const response = await fetch('/predict', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          setPrediction(data.prediction);
        } catch (error) {
          console.error('Error al enviar al backend:', error);
        }
      }

      requestAnimationFrame(captureAndSendFrame);
    };
    captureAndSendFrame();

    // Limpiar el bucle cuando se desmonte el componente
    return () => {
      running = false;
    };
  }, [isCameraReady]);

  function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }



  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <BackgroundImage
        src="/src/assets/fondo_bloques.png"
        style={{
          width: '100vw',
          height: '95vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Grid p={0}>
          <Grid.Col span={12}>
            <Group style={{ width: '100%' }}>
              <Text fz={35} m={60} c='white'>PREDICTION: {prediction}</Text>
              <Box ml={60} 
              style={{
                height: "210px",
                border: "5px solid #4a90e2",
                borderRadius: "10px",
              }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                mirrored={true}
                imageSmoothing={true}
                onUserMedia={handleUserMedia}
              />
              </Box>
            </Group>
          </Grid.Col>
          
            <Grid.Col style={{ position: 'absolute', top: '53%' }}>
          <AmongusLetter prediction={prediction} speed={3} isPaused={true}/>
          </Grid.Col>
        </Grid>
      </BackgroundImage>
    </>
  );
};

