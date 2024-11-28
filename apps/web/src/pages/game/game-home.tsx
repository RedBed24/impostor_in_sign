import { Container, Title, Button, Text, Group } from '@mantine/core';
import { LucideGamepad, Check, X } from 'lucide-react';
import Webcam from "react-webcam";
import { useRef, useState, useCallback, useEffect } from "react";
import { NodeJS } from 'node';

const videoConstraints = { 
  width: 300,
  height: 300,
  facingMode: "user"
};

// onUserMediaError
export const GameHome: React.FC = () => {
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
      // Enviar la captura a la URL deseada
      fetch('http://localhost:8080/predict', {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('file', dataURItoBlob(imageSrc), 'screenshot.jpg');
          return formData;
        })(),
      })
      .then(response => response.json())
      .then(data => {
        setPrediction(data.prediction);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }, [webcamRef]);

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

  useEffect(() => {
    if (isCaptureEnable) {
      const id = setInterval(capture, 100); // 100 ms = 0.1 segundos
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isCaptureEnable, capture, intervalId]);

  const alphabet = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ];

  // Estado para la letra seleccionada
  const [currentLetter, setCurrentLetter] = useState("");

  // Función para generar una letra aleatoria
  const generateRandomLetter = () => {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    setCurrentLetter(alphabet[randomIndex]);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <Container>
        <Title>Impostor in Sign</Title>
        <LucideGamepad />
        {isCaptureEnable || (
          <Button onClick={() => setCaptureEnable(true)}>start</Button>
        )}

         {isCaptureEnable && (
        <>
            <Button onClick={() => setCaptureEnable(false)}>end </Button>
            <Group>
            <Webcam
              audio={false}
              width={540}
              height={360}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              mirrored={true}
              imageSmoothing={true}
            />
            {currentLetter.toLowerCase() === prediction?.toLowerCase() ? <Check size={48} /> : <X size={48}/>}
            </Group>
        </>
      )}
      <Text>PREDICTION: {prediction}</Text>
      <Group> 
        <Button onClick={generateRandomLetter}>
          Generar Letra
        </Button>
      <Text>LETTER : {currentLetter}</Text>
      </Group>

      </Container>
    </>
  );
};

