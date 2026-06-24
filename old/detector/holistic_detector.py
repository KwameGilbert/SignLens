import cv2
import numpy as np
import mediapipe as mp

class HolisticDetector:
    def __init__(self, config):
        # HOLISTIC MODEL + DRAWING UTILS
        self.mp_holistic = mp.solutions.holistic
        self.mp_drawing = mp.solutions.drawing_utils
        
        self.model = self.mp_holistic.Holistic(
            min_detection_confidence=config['mediapipe']['detection_confidence'],
            min_tracking_confidence=config['mediapipe']['tracking_confidence']
            )

    def detect(self, image):
    # DETECT LANDMARKS
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        rgb_image.flags.writeable = False
        results = self.model.process(rgb_image)
        rgb_image.flags.writeable = True
        image = cv2.cvtColor(rgb_image, cv2.COLOR_RGB2BGR)
        return image, results

    def draw_landmarks(self, image, results):

        mp_draw = self.mp_drawing
        mp_holistic = self.mp_holistic

        # Face
        if results.face_landmarks:
            mp_draw.draw_landmarks(
                image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION,
                mp_draw.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1),
                mp_draw.DrawingSpec(color=(80,256,121), thickness=1, circle_radius=1)
            )

        # Pose
        if results.pose_landmarks:
            mp_draw.draw_landmarks(
                image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
                mp_draw.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
                mp_draw.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
            )

        # Left Hand
        if results.left_hand_landmarks:
            mp_draw.draw_landmarks(
                image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
                mp_draw.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4),
                mp_draw.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
            )
        
        # Right Hand
        if results.right_hand_landmarks:
            mp_draw.draw_landmarks(
                image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
                mp_draw.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4),
                mp_draw.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
            )
        
    def close(self):
        self.model.close()