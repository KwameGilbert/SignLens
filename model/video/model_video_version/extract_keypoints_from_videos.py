import os
import cv2
import numpy as np
import mediapipe as mp

# Configuration
VIDEOS_DIR = os.path.join('..', 'dataset_video')  # Folder containing class subfolders with videos
OUTPUT_DIR = os.path.join('..', 'dataset_video_keypoints')
SEQUENCE_LENGTH = 30  # Frames per sequence
SEQUENCES_PER_CLASS = 30  # Sequences per class

mp_holistic = mp.solutions.holistic

# Utility: Extract keypoints from a single frame using MediaPipe Holistic
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
    return np.concatenate([pose, face, lh, rh])  # (1662,)

# Main extraction function
def process_videos():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    for class_name in os.listdir(VIDEOS_DIR):
        class_path = os.path.join(VIDEOS_DIR, class_name)
        if not os.path.isdir(class_path):
            continue
        output_class_dir = os.path.join(OUTPUT_DIR, class_name)
        os.makedirs(output_class_dir, exist_ok=True)
        video_files = [f for f in os.listdir(class_path) if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))]
        seq_count = 0
        for video_file in video_files:
            if seq_count >= SEQUENCES_PER_CLASS:
                break
            video_path = os.path.join(class_path, video_file)
            cap = cv2.VideoCapture(video_path)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            if frame_count < SEQUENCE_LENGTH:
                cap.release()
                continue  # Skip too-short videos
            # Evenly sample SEQUENCE_LENGTH frames from the video
            indices = np.linspace(0, frame_count - 1, SEQUENCE_LENGTH, dtype=int)
            frames = []
            with mp_holistic.Holistic(static_image_mode=False) as holistic:
                for idx in indices:
                    cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
                    ret, frame = cap.read()
                    if not ret:
                        continue
                    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = holistic.process(image)
                    keypoints = extract_keypoints(results)
                    frames.append(keypoints)
                cap.release()
            if len(frames) == SEQUENCE_LENGTH:
                np.save(os.path.join(output_class_dir, f"{seq_count}.npy"), np.array(frames))
                seq_count += 1
            if seq_count >= SEQUENCES_PER_CLASS:
                break
        print(f"Class '{class_name}': {seq_count} sequences saved.")

if __name__ == "__main__":
    process_videos()
