import cv2
import numpy as np
import os
import time
import mediapipe as mp
from tensorflow.keras.models import load_model

# Text-to-Speech
import pyttsx3

# --- Configuration ---
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'dataset')
SEQUENCE_LENGTH = 30
colors = [(245,117,16), (117,245,16), (16,117,245)]

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

def prob_viz(res, actions, input_frame, colors):
    output_frame = input_frame.copy()
    for num, prob in enumerate(res):
        cv2.rectangle(output_frame, (0,60+num*40), (int(prob*100), 90+num*40), colors[num%len(colors)], -1)
        cv2.putText(output_frame, actions[num], (0, 85+num*40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2, cv2.LINE_AA)
        
    return output_frame

def main():
    print("="*60)
    print("SignLens - Real-Time Sign Language Recognition")
    print("="*60)
    
    # 1. Load Model
    print("\n[1/4] Loading model...")
    model_path = os.path.join(os.path.dirname(__file__), '..', 'sign_language_model.h5')
    if not os.path.exists(model_path):
        print("❌ Model not found! Please run train_model.py first (after collecting data).")
        return
    
    try:
        model = load_model(model_path)
        print("✓ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return
    
    # 2. Load Actions (Labels)
    print("\n[2/4] Loading sign classes...")
    if not os.path.exists(DATA_PATH):
        print("❌ Dataset directory not found!")
        return
    
    try:
        actions = np.array([folder for folder in os.listdir(DATA_PATH) if os.path.isdir(os.path.join(DATA_PATH, folder))])
        actions = np.sort(actions)
        print(f"✓ Loaded {len(actions)} sign classes: {actions}")
    except Exception as e:
        print(f"❌ Error loading classes: {e}")
        return
    
    # 3. Setup Camera
    print("\n[3/4] Initializing camera...")
    cap = None
    camera_index = 0
    
    # Try multiple camera indices (0, 1, 2, etc.)
    for idx in range(5):
        print(f"  Trying camera index {idx}...", end=" ")
        cap = cv2.VideoCapture(idx)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        if cap.isOpened():
            print("✓ Opened")
            # Test reading a frame
            ret, test_frame = cap.read()
            if ret and test_frame is not None:
                print(f"  ✓ Successfully read frame ({test_frame.shape[1]}x{test_frame.shape[0]})")
                camera_index = idx
                break
            else:
                print("✗ Failed to read")
                cap.release()
                cap = None
        else:
            print("✗ Not available")
    
    if cap is None or not cap.isOpened():
        print("\n❌ Error: Could not open any camera! Check if webcam is connected and working.")
        return
    
    # Set camera properties for better performance
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)
    
    print(f"✓ Camera initialized on index {camera_index}!")
    
    # Variables
    sequence = []
    sentence = []
    predictions = []
    threshold = 0.5
    frame_num = 0

    # Text-to-Speech Engine
    print("\n[4/4] Initializing Text-to-Speech...")
    try:
        tts_engine = pyttsx3.init()
        tts_engine.setProperty('rate', 150)
        last_spoken = ''
        print("✓ TTS initialized!")
    except Exception as e:
        print(f"⚠ Warning: TTS unavailable ({e}). Continuing without audio...")
        tts_engine = None
        last_spoken = ''

    print("\n" + "="*60)
    print("STARTING REAL-TIME DETECTION")
    print("Press 'q' to quit")
    print("="*60)
    
    # Warm up camera - read a few dummy frames
    print("\nWarming up camera...", end="", flush=True)
    time.sleep(0.5)  # Let camera stabilize
    for _ in range(10):
        ret, _ = cap.read()
        if ret:
            print(".", end="", flush=True)
    print(" ✓")
    print()

    # 4. Start Inference
    try:
        with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
            frame_errors = 0
            while cap.isOpened():

                # Read feed with retry logic
                ret, frame = cap.read()
                
                if not ret or frame is None:
                    frame_errors += 1
                    if frame_errors > 3:
                        print(f"❌ Error: Failed to read frame from camera ({frame_errors} consecutive failures)")
                        break
                    else:
                        print(f"⚠ Frame read failed (attempt {frame_errors}/3), retrying...")
                        continue
                else:
                    frame_errors = 0  # Reset error counter on success
                    
                frame_num += 1

                # Make detections
                image, results = mediapipe_detection(frame, holistic)
                
                # Draw landmarks
                draw_styled_landmarks(image, results)
                
                # Prediction logic
                keypoints = extract_keypoints(results)
                sequence.append(keypoints)
                sequence = sequence[-SEQUENCE_LENGTH:] # Keep only last 30 frames
                

                # Only predict every 5 frames (to stabilize and save CPU)
                if len(sequence) == SEQUENCE_LENGTH and frame_num % 5 == 0:
                    res = model.predict(np.expand_dims(sequence, axis=0), verbose=1)[0]
                    predicted_class = np.argmax(res)
                    confidence = res[predicted_class]
                    
                    print(f"Frame {frame_num} | {actions[predicted_class]}: {confidence:.2f}")
                    predictions.append(predicted_class)

                    # Visualization logic
                    if len(predictions) >= 2 and np.unique(predictions[-2:])[0] == predicted_class:
                        if confidence > threshold:
                            detected_sign = actions[predicted_class]
                            if len(sentence) > 0:
                                if detected_sign != sentence[-1]:
                                    sentence = [detected_sign] # Replace with new sign (don't append)
                                    # Speak the detected sign
                                    if detected_sign != last_spoken and detected_sign.lower() != 'neutral' and tts_engine:
                                        try:
                                            tts_engine.say(detected_sign)
                                            tts_engine.runAndWait()
                                            last_spoken = detected_sign
                                        except Exception as e:
                                            print(f"⚠ TTS Error: {e}")
                            else:
                                sentence = [detected_sign]
                                if detected_sign != last_spoken and detected_sign.lower() != 'neutral' and tts_engine:
                                    try:
                                        tts_engine.say(detected_sign)
                                        tts_engine.runAndWait()
                                        last_spoken = detected_sign
                                    except Exception as e:
                                        print(f"⚠ TTS Error: {e}")

                    if len(sentence) > 1:
                        sentence = sentence[-1:]

                cv2.rectangle(image, (0,0), (640, 40), (245, 117, 16), -1)
                
                # Display logic
                display_text = ' '.join(sentence)
                if display_text == 'Neutral':
                    display_text = ''
                    
                cv2.putText(image, display_text, (3,30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                
                # Show to user
                cv2.imshow('OpenCV Feed', image)

                # Break gracefully
                if cv2.waitKey(10) & 0xFF == ord('q'):
                    print("\n✓ Quitting...")
                    break
    
    except KeyboardInterrupt:
        print("\n⚠ Interrupted by user")
    except Exception as e:
        print(f"❌ Error during inference: {e}")
        import traceback
        traceback.print_exc()
    finally:
        print("\nCleaning up...")
        cap.release()
        cv2.destroyAllWindows()
        print("✓ Done!")

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"FATAL ERROR: {e}")
        print(f"{'='*60}")
        import traceback
        traceback.print_exc()
        input("Press Enter to exit...")
