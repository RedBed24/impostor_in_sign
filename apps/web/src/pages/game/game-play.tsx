import { Container, Title, Text, Group, Box, BackgroundImage, Grid, Button, Skeleton, Modal, Stack, Image } from '@mantine/core';
import { Pause, Play, LogOut } from 'lucide-react';

import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react";
import AmongusLetter from '../../components/amongus_letter';
import GameState from '../../store/game-state';
import {Results} from './results';

const videoConstraints = {
    width: 200,
    height: 200,
    facingMode: "user"
};


export const GamePlay: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [isCameraReady, setCameraReady] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const { lives, score, level } = GameState();


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

    if (lives < 2) {
        return <Results />;
      }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <BackgroundImage
                src="/src/assets/fondo_bloques.png"
                style={{
                    width: '99vw',
                    height: '98vh',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Grid p={0}>
                    <Grid.Col span={8} mt={30}>
                        <Group style={{ width: '100%' }} display='flex' align='flex-start'>
                        <Box p={10} style={{ display: 'flex', flexDirection: 'row', justifyContent:'flex-start',
                            border: "3px solid #FFFFFF",
                            borderRadius: "15px", align:'flex-start', marginLeft: 30, marginRight:150}}>
                                <Image width={50} height={50} src={lives >=2 ? "/src/assets/vida.png": "/src/assets/muerte.png"}/>
                                <Image width={50} height={50} src={lives >=4 ? "/src/assets/vida.png": "/src/assets/muerte.png"}/>
                                <Image width={50} height={50} src={lives == 6 ? "/src/assets/vida.png": "/src/assets/muerte.png"}/>
                            </Box>
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
                            <Text fz={30} c='white'>PREDICTION: {prediction}</Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Text fz={30} c='white' mr={50}>SCORE: {score}</Text>
                        <Button size="xl" onClick={() => setIsPaused(true)}><Pause/> </Button>
                    </Grid.Col>
                    <Grid.Col style={{ position: 'absolute', top: '57%' }}>
                        <AmongusLetter prediction={prediction} speed={5} isPaused={isPaused} color='red'/>
                    </Grid.Col>
                </Grid>


            <Modal opened={isPaused} onClose={() => setIsPaused(false)} title="Menú de Pausa" centered 
            overlayProps={{
          backgroundOpacity: 0.55,
          blur: 1,
        }}>
            <Stack>
                <Button onClick={() => setIsPaused(false)} rightSection={<Play/>}>JUGAR</Button>
                <Button color='red' rightSection={<LogOut/>}>SALIR</Button>
            </Stack>
                
            </Modal>
            </BackgroundImage>
        </>
    );
};

