import cv2
import mediapipe as mp
import numpy as np


# herencia
class HandPointsDetector:

    def __init__(self, min_detection_confidence=0.3, static_image_mode=True, min_tracking_confidence=0.5):
        self._hands = mp.solutions.hands.Hands(
            static_image_mode=static_image_mode,
            max_num_hands=1,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

    def process_image(self, img):
        img_np = np.frombuffer(img, np.uint8)

        # Decodifica el array de NumPy para obtener la imagen en formato OpenCV
        image = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        results = self._hands.process(img_rgb) #image was on left side, duplicar datos para la izquierda?
        if not results.multi_hand_landmarks or not results.multi_handedness:
            return None

        if results.multi_handedness[0].classification[0].label == 'Left':
            img_rgb = cv2.flip(img_rgb, 1)
            results = self._hands.process(img_rgb)

        if results.multi_hand_landmarks is None:
            return None

        all_x = []
        all_y = []
        for hand_landmarks in results.multi_hand_landmarks:
            for i in range(len(hand_landmarks.landmark)):
                all_x.append(hand_landmarks.landmark[i].x)
                all_y.append(hand_landmarks.landmark[i].y)
        return (all_x, all_y)