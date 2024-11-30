import { Container, Title, Text, Group, Box } from '@mantine/core';
// import { Check, X } from 'lucide-react';
import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react";
import AmongusLetter from '../../components/amongus_letter';

const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: "user"
};

export const GameHome: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isCameraReady, setCameraReady] = useState(false);


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
      <Container>
        <Title>Impostor in Sign</Title>
        <Text fz={35} m={30}>PREDICTION: {prediction}</Text>

        <Group gap='xs'>
          <Box
            style={{
              border: "5px solid #4a90e2",
              borderRadius: "10px",
              width: "310px",
              height: "310px",
              margin: "auto",
              overflow: "hidden",
            }}
          >
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
          <AmongusLetter prediction={prediction} />

        </Group>
      </Container>
    </>
  );
};

