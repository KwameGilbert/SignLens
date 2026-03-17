import os
import numpy as np
import cv2
import mediapipe as mp
from tensorflow.keras.models import load_model

SEQUENCE_LENGTH = 30
DATASET_PATH = os.path.join('model_video_version', 'dataset_video')
MODEL_PATH = os.path.join('model_video_version', 'sign_language_model_video.h5')

mp_holistic = mp.solutions.holistic

def extract_keypoints(results):
    pose = np.zeros(33 * 4)
    face = np.zeros(468 * 3)
    lh = np.zeros(21 * 3)
    rh = np.zeros(21 * 3)
    if results.pose_landmarks:
        pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten()
    if results.face_landmarks:
        face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten()
    if results.left_hand_landmarks:
        lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten()
    if results.right_hand_landmarks:
        rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten()
    return np.concatenate([pose, face, lh, rh])

def get_actions():
    return np.array([folder for folder in os.listdir(DATASET_PATH) if os.path.isdir(os.path.join(DATASET_PATH, folder))])

def main():
    actions = get_actions()
    model = load_model(MODEL_PATH)
    sequence = []
    cap = cv2.VideoCapture(0)
    with mp_holistic.Holistic(static_image_mode=False) as holistic:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = holistic.process(image)
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
            if len(sequence) > SEQUENCE_LENGTH:
                sequence = sequence[-SEQUENCE_LENGTH:]
            if len(sequence) == SEQUENCE_LENGTH:
                input_data = np.expand_dims(sequence, axis=0)
                predictions = model.predict(input_data)
                predicted_class = np.argmax(predictions)
                confidence = np.max(predictions)
                sign = actions[predicted_class]
                cv2.putText(frame, f"{sign} ({confidence:.2f})", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2, cv2.LINE_AA)
            cv2.imshow('SignLens Video Model', frame)
            if cv2.waitKey(10) & 0xFF == ord('q'):
                break
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
