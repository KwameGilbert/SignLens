import os
import cv2
import numpy as np
import mediapipe as mp

IMAGE_DATASET_DIR = os.path.join('..', '..', 'dataset', 'image')
OUTPUT_DIR = os.path.join('..', '..', 'dataset', 'static_keypoints_optimized')

# Standard alphabet + Neutral
CLASSES = [chr(i) for i in range(ord('A'), ord('Z')+1)] + ['Neutral']

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
    return np.concatenate([pose, lh, rh])  # 258 features

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    with mp_holistic.Holistic(static_image_mode=True) as holistic:
        for class_name in CLASSES:
            class_path = os.path.join(IMAGE_DATASET_DIR, class_name)
            output_class_path = os.path.join(OUTPUT_DIR, class_name)
            
            if not os.path.exists(class_path):
                print(f"Skipping {class_name}, directory not found.")
                continue
                
            os.makedirs(output_class_path, exist_ok=True)
            
            images = [f for f in os.listdir(class_path) if f.endswith(('.jpg', '.jpeg', '.png'))]
            print(f"Processing class '{class_name}' ({len(images)} images)...")
            
            for img_name in images:
                img_path = os.path.join(class_path, img_name)
                image = cv2.imread(img_path)
                if image is None:
                    continue
                
                # Convert BGR to RGB for MediaPipe
                image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                results = holistic.process(image_rgb)
                
                keypoints = extract_keypoints(results)
                
                # Save the 1D array as a .npy file
                base_name = os.path.splitext(img_name)[0]
                np.save(os.path.join(output_class_path, f"{base_name}.npy"), keypoints)

if __name__ == "__main__":
    main()
