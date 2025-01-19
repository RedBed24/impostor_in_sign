"""Module to detect hand points using MediaPipe Hands."""

import mediapipe as mp
from typing import Any
import cv2
import numpy as np


class HandPointsDetector:
    """Class to detect hand points using MediaPipe Hands."""

    def __init__(self, min_detection_confidence=0.3, static_image_mode=True, min_tracking_confidence=0.5) -> None:
        """Initializes the HandPointsDetector object by default one hand is detected."""
        self._hands = mp.solutions.hands.Hands(
            static_image_mode=static_image_mode,
            max_num_hands=1,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

    def process_image(self, img: bytes)-> None | tuple[list[Any], list[Any]]:
        """Processes the bytes image and returns the hand points or None if no hand is detected."""
        img_np = np.frombuffer(img, np.uint8) #byes to numpy array

        # Decode the image
        image = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        results = self._hands.process(img_rgb) 
        if not results.multi_hand_landmarks or not results.multi_handedness:
            return None

        # Flip the image if the hand is detected on the left side
        if results.multi_handedness[0].classification[0].label == 'Left': 
            img_rgb = cv2.flip(img_rgb, 1)
            results = self._hands.process(img_rgb)

        if results.multi_hand_landmarks is None:
            return None

         # Get all the 21 x and y coordinates of the hand
        all_x = [landmark.x for hand_landmarks in results.multi_hand_landmarks for landmark in hand_landmarks.landmark]
        all_y = [landmark.y for hand_landmarks in results.multi_hand_landmarks for landmark in hand_landmarks.landmark]

        return (all_x, all_y)