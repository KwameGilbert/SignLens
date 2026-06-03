import os
import numpy as np
import cv2
import mediapipe as mp
from tensorflow.keras.models import load_model

SEQUENCE_LENGTH = 30
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'dataset', 'video_raw')
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'saved_models', 'sign_language_model_video_2.h5')

mp_holistic = mp.solutions.holistic

def extract_keypoints(results):
    pose = np.zeros(33 * 4)
    lh = np.zeros(21 * 3)
    rh = np.zeros(21 * 3)
    if results.pose_landmarks:
        pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten()
    if results.left_hand_landmarks:
        lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten()
    if results.right_hand_landmarks:
        rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten()
    return np.concatenate([pose, lh, rh])

def get_actions():
    return np.array([folder for folder in os.listdir(DATASET_PATH) if os.path.isdir(os.path.join(DATASET_PATH, folder))])

def main():
    actions = get_actions()
    model = load_model(MODEL_PATH)
    sequence = []
    
    # Use cv2.CAP_DSHOW on Windows to prevent the dim/dark camera issue
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    # Set up the window so it doesn't hide behind others
    cv2.namedWindow('SignLens Video Model', cv2.WINDOW_NORMAL)
    cv2.setWindowProperty('SignLens Video Model', cv2.WND_PROP_TOPMOST, 1)
    
    if not cap.isOpened():
        print("Error: Could not open the camera. Check your camera permissions or index.")
        return

    with mp_holistic.Holistic(static_image_mode=False) as holistic:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("Error: Could not read frame from camera. Is it being used by another application?")
                break
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = holistic.process(image)
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
            if len(sequence) > SEQUENCE_LENGTH:
                sequence = sequence[-SEQUENCE_LENGTH:]
            if len(sequence) == SEQUENCE_LENGTH:
                input_data = np.expand_dims(sequence, axis=0)
                predictions = model.predict(input_data, verbose=0)
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
