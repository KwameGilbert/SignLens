import cv2
import numpy as np
import os
import mediapipe as mp
import time
import shutil

# --- Configuration ---
# Root directory where dataset keypoints are saved (no-face version)
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'dataset', 'video_keypoints_no_face')
SEQUENCE_LENGTH = 30  # 30 frames per gesture sequence
NO_SEQUENCES = 30     # Record 30 distinct sequences per sign

# --- MediaPipe Setup ---
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils

def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image.flags.writeable = False
    results = model.process(image)
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    return image, results

def draw_styled_landmarks(image, results):
    # Only draw pose and hands for overlay (skip face mesh for privacy and speed)
    mp_drawing.draw_landmarks(
        image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
        mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
    )
    mp_drawing.draw_landmarks(
        image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4),
        mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
    )
    mp_drawing.draw_landmarks(
        image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4),
        mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
    )

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
    print("=" * 60)
    print("SignLens Optimized Keypoint Data Collection Tool (258 features)")
    print("=" * 60)
    
    # Get sign name
    action = input("Enter the name of the sign/letter you want to collect (e.g., 'A', 'B', 'Neutral'): ").strip()
    if not action:
        print("Invalid sign name. Exiting.")
        return

    action_path = os.path.join(DATA_PATH, action)
    
    # If folder already exists, confirm overwrite
    if os.path.exists(action_path):
        confirm = input(f"Directory for '{action}' already exists. Overwrite? (y/n): ").strip().lower()
        if confirm == 'y':
            shutil.rmtree(action_path)
            os.makedirs(action_path)
        else:
            print("Appending to existing data is not supported. Exiting to avoid corruption.")
            return
    else:
        os.makedirs(action_path, exist_ok=True)

    print(f"\nRecording to: {action_path}")
    print(f"Preparing to collect {NO_SEQUENCES} distinct sequences of {SEQUENCE_LENGTH} frames each.")
    print("Please place your hand in front of the camera.")
    print("Tip: Vary your hand distance, height, and angle slightly between sequences so the model generalizes!")
    
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # Use CAP_DSHOW on Windows for fast startup
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    if not cap.isOpened():
        print("Error: Could not open the webcam.")
        return

    cv2.namedWindow('OpenCV Feed', cv2.WINDOW_NORMAL)
    cv2.setWindowProperty('OpenCV Feed', cv2.WND_PROP_TOPMOST, 1)

    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        for sequence in range(NO_SEQUENCES):
            sequence_frames = []
            
            # 1-second countdown/preview before starting the sequence capture
            start_time = time.time()
            while time.time() - start_time < 1.0:
                ret, frame = cap.read()
                if not ret:
                    break
                image, results = mediapipe_detection(frame, holistic)
                draw_styled_landmarks(image, results)
                
                # Show countdown
                cv2.putText(image, 'PREPARING...', (120, 200), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 255), 4, cv2.LINE_AA)
                cv2.putText(image, f'Collecting {action} | Sequence {sequence}/{NO_SEQUENCES}', (15, 30), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.imshow('OpenCV Feed', image)
                cv2.waitKey(1)
                
            # Capture the 30-frame sequence
            for frame_num in range(SEQUENCE_LENGTH):
                ret, frame = cap.read()
                if not ret:
                    print("Error reading frame.")
                    break
                image, results = mediapipe_detection(frame, holistic)
                draw_styled_landmarks(image, results)
                
                # Overlay current sequence info
                cv2.putText(image, 'RECORDING ACTION', (120, 200), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 4, cv2.LINE_AA)
                cv2.putText(image, f'Collecting {action} | Sequence {sequence}/{NO_SEQUENCES} | Frame {frame_num}/{SEQUENCE_LENGTH}', (15, 30), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.imshow('OpenCV Feed', image)
                
                keypoints = extract_keypoints(results)
                sequence_frames.append(keypoints)
                
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    cap.release()
                    cv2.destroyAllWindows()
                    return
            
            # Save the captured sequence keypoints
            npy_path = os.path.join(action_path, f"{sequence}.npy")
            np.save(npy_path, np.array(sequence_frames))
            print(f"[+] Saved sequence {sequence}/{NO_SEQUENCES} to {sequence}.npy")
            
        print(f"\n[Finished] Recorded all 30 sequences for sign: '{action}'")
        
    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
