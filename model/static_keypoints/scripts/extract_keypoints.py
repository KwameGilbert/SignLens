import os
import cv2
import numpy as np
import mediapipe as mp

DATASET_DIR = os.path.join('..', '..', 'dataset', 'static_keypoints')
CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'Neutral', 'O', 'P', 'Q', 'R', 'S', 'hello']
SEQUENCE_LENGTH = 30
SEQUENCES_PER_CLASS = 30

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

def main():
    if not os.path.exists(DATASET_DIR):
        os.makedirs(DATASET_DIR)
    for class_name in CLASSES:
        class_dir = os.path.join(DATASET_DIR, class_name)
        os.makedirs(class_dir, exist_ok=True)
        for seq_num in range(SEQUENCES_PER_CLASS):
            sequence = []
            cap = cv2.VideoCapture(0)
            with mp_holistic.Holistic(static_image_mode=False) as holistic:
                for frame_num in range(SEQUENCE_LENGTH):
                    ret, frame = cap.read()
                    if not ret:
                        continue
                    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = holistic.process(image)
                    keypoints = extract_keypoints(results)
                    sequence.append(keypoints)
                cap.release()
            if len(sequence) == SEQUENCE_LENGTH:
                np.save(os.path.join(class_dir, f"{seq_num}.npy"), np.array(sequence))
            print(f"Class '{class_name}' sequence {seq_num} saved.")

if __name__ == "__main__":
    main()
