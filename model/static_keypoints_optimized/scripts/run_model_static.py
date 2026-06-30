import os
import numpy as np
import cv2
import mediapipe as mp
from tensorflow.keras.models import load_model
import glob

def get_latest_model():
    model_dir = os.path.join(os.path.dirname(__file__), '..', 'saved_models')
    models = glob.glob(os.path.join(model_dir, '*.h5'))
    if not models:
        raise FileNotFoundError(f"No models found in {model_dir}")
    return max(models, key=os.path.getmtime)

MODEL_PATH = get_latest_model()
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
    return np.concatenate([pose, lh, rh])

def main():
    if not os.path.exists(MODEL_PATH):
        print(f"Model not found at {MODEL_PATH}. Please train it first.")
        return
        
    model = load_model(MODEL_PATH)
    
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    
    cv2.namedWindow('Static Keypoints Optimized', cv2.WINDOW_NORMAL)
    cv2.setWindowProperty('Static Keypoints Optimized', cv2.WND_PROP_TOPMOST, 1)

    with mp_holistic.Holistic(static_image_mode=False) as holistic:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = holistic.process(image)
            
            # Predict every single frame instantly
            keypoints = extract_keypoints(results)
            input_data = np.expand_dims(keypoints, axis=0) # shape (1, 258)
            
            predictions = model.predict(input_data, verbose=0)
            predicted_class = np.argmax(predictions)
            confidence = np.max(predictions)
            sign = CLASSES[predicted_class]
            
            cv2.putText(frame, f"{sign} ({confidence:.2f})", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
            cv2.imshow('Static Keypoints Optimized', frame)
            
            if cv2.waitKey(10) & 0xFF == ord('q'):
                break
                
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
