'''
Python 3.10
opencv-python, matplotlib, mediapipe, scikit-learn, numpy
'''
import cv2
import numpy as np
import mediapipe as mp
import os
import time
import matplotlib

# HOLISTIC MODEL + DRAWING UTILS
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils

# DETECT LANDMARKS
def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image.flags.writeable = False
    results = model.process(image)
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    return image, results

# SAFE DRAW FUNCTION
def draw_styled_landmarks(image, results):
    # Face
    if results.face_landmarks:
        mp_drawing.draw_landmarks(
            image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION,
            mp_drawing.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1),
            mp_drawing.DrawingSpec(color=(80,256,121), thickness=1, circle_radius=1)
        )

    # Pose
    if results.pose_landmarks:
        mp_drawing.draw_landmarks(
            image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
            mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
        )

    # Left Hand
    if results.left_hand_landmarks:
        mp_drawing.draw_landmarks(
            image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4),
            mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
        )

    # Right Hand
    if results.right_hand_landmarks:
        mp_drawing.draw_landmarks(
            image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4),
            mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
        )


# EXTRACT KEYPOINT VALUES (always returns arrays)
def extract_keypoints(results):
    face = np.array([[lm.x, lm.y, lm.z] for lm in
                     results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros((468, 3)).flatten()

    pose = np.array([[lm.x, lm.y, lm.z, lm.visibility] for lm in
                     results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros((33, 4)).flatten()

    left_hand = np.array([[lm.x, lm.y, lm.z] for lm in
                          results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros((21, 3)).flatten()

    right_hand = np.array([[lm.x, lm.y, lm.z] for lm in
                           results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros((21, 3)).flatten()

    return face, pose, left_hand, right_hand


# =============================
#   MAIN VIDEO LOOP
# =============================
cap = cv2.VideoCapture(0)

with mp_holistic.Holistic(
    min_detection_confidence=0.5, min_tracking_confidence=0.5
    ) as holistic:

    while cap.isOpened():

        ret, frame = cap.read()
        if not ret:
            print("Camera read failed.")
            break

        # Detect
        image, results = mediapipe_detection(frame, holistic)

        # Draw
        draw_styled_landmarks(image, results)

        # Extract Keypoints
        face, pose, left_hand, right_hand = extract_keypoints(results)

        keypoints = np.concatenate([face, pose, left_hand, right_hand])
        print(f'Total Keypoints Shape: {keypoints.shape}')
        print(f'Pose Shape: {pose.shape}')
        print(f'Face Shape: {face.shape}')
        print(f'Left Hand Shape: {left_hand.shape}')
        print(f'Right Hand Shape: {right_hand.shape}')


        # 4) Display
        cv2.imshow("OpenCV Feed", image)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
