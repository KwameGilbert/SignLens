import cv2
import numpy as np
import os
import mediapipe as mp
import time
import shutil

# --- Configuration ---
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'dataset')
SEQUENCE_LENGTH = 30  # Frames per sequence
NO_SEQUENCES = 30     # Number of sequences to collect

# --- MediaPipe Setup ---
mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils

print("All imports successful!")


def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image.flags.writeable = False
    results = model.process(image)
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    return image, results

def draw_styled_landmarks(image, results):
    # Draw face connections
    mp_drawing.draw_landmarks(
        image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION,
        mp_drawing.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1),
        mp_drawing.DrawingSpec(color=(80,256,121), thickness=1, circle_radius=1)
    )
    # Draw pose connections
    mp_drawing.draw_landmarks(
        image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
        mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
    )
    # Draw left hand connections
    mp_drawing.draw_landmarks(
        image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4),
        mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
    )
    # Draw right hand connections
    mp_drawing.draw_landmarks(
        image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
        mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4),
        mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
    )

def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros(468*3)
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, face, lh, rh])

def main():
    print("=" * 50)
    print("SignLens Data Collection Tool")
    print("=" * 50)
    
    # 1. Ask for the action (sign) to record
    action = input("Enter the name of the sign you want to collect (e.g., 'A'): ").strip()
    if not action:
        print("Invalid name. Exiting.")
        return

    # 2. Create directory for the action
    action_path = os.path.join(DATA_PATH, action)
    if os.path.exists(action_path):
        shutil.rmtree(action_path)
    os.makedirs(action_path)
    print(f"Saving data to: {action_path}")
    print(f"Please prepare to record {NO_SEQUENCES} sequences of {SEQUENCE_LENGTH} frames each.")

    # 3. Setup Camera
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return
    
    # 4. Start Collection
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        
        # Loop through sequences
        for sequence in range(NO_SEQUENCES):
            
            sequence_frames = [] # Collect frames for this sequence

            # Loop through video length aka sequence length
            for frame_num in range(SEQUENCE_LENGTH):

                # Read feed
                ret, frame = cap.read()
                if not ret:
                    print("Error reading frame.")
                    break

                # Make detections
                image, results = mediapipe_detection(frame, holistic)

                # Draw landmarks
                draw_styled_landmarks(image, results)
                
                # Apply wait logic (Give user a break between sequences)
                if frame_num == 0:
                    cv2.putText(image, 'STARTING COLLECTION', (120,200), 
                               cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255, 0), 4, cv2.LINE_AA)
                    cv2.putText(image, 'Collecting {} Video Number {}'.format(action, sequence), (15,12), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)
                    # Show to user
                    cv2.imshow('OpenCV Feed', image)
                    cv2.waitKey(1000) # Wait 1 second
                else: 
                    cv2.putText(image, 'Collecting {} Video Number {}'.format(action, sequence), (15,12), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)
                    # Show to user
                    cv2.imshow('OpenCV Feed', image)
                
                # Export keypoints
                keypoints = extract_keypoints(results)
                sequence_frames.append(keypoints)

                # Break gracefully
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    cap.release()
                    cv2.destroyAllWindows()
                    return

            # Save the sequence
            npy_path = os.path.join(action_path, str(sequence))
            np.save(npy_path, np.array(sequence_frames))
            print(f"Saved sequence {sequence} to {npy_path}.npy")

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    try:
        print("Script started successfully!")
        main()
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        input("Press Enter to exit...")

