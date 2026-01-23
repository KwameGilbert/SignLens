"""
SignLens Real-Time Inference
Main entry point for running sign language recognition on live webcam feed.

All settings are read from config.yaml - no hardcoded values.

Usage:
    python main.py
"""

import cv2
import numpy as np
import os

from config.loader import ConfigLoader
from detector.holistic_detector import HolisticDetector
from detector.keypoints import extract_keypoints
from model.predictor import SignPredictor
from ui.overlay import UIOverlay
from utils.fps_counter import FPSCounter
from utils.logger import setup_logger


def main():
    """Main inference loop - all settings from config."""
    
    # 1. Load Configuration
    config = ConfigLoader.load_config()
    logger = setup_logger(config)
    
    # Get settings from config
    camera_config = config.get('camera', {})
    camera_index = camera_config.get('index', 0)
    camera_width = camera_config.get('width', 640)
    camera_height = camera_config.get('height', 480)
    
    data_config = config.get('data_collection', {})
    sequence_length = data_config.get('sequence_length', 30)
    
    inference_config = config.get('inference', {})
    threshold = inference_config.get('prediction_threshold', 0.5)
    prediction_interval = inference_config.get('prediction_interval', 5)
    
    ui_config = config.get('ui', {})
    show_landmarks = ui_config.get('show_landmarks', True)
    window_name = ui_config.get('window_name', 'SignLens')
    
    colors = ui_config.get('colors', {})
    header_color = tuple(colors.get('primary', [245, 117, 16]))
    
    logger.info("=" * 50)
    logger.info("SignLens Real-Time Inference")
    logger.info("=" * 50)
    
    print("=" * 50)
    print("  SignLens Real-Time Inference")
    print("=" * 50)
    print(f"\nConfiguration:")
    print(f"  Camera: index={camera_index}, resolution={camera_width}x{camera_height}")
    print(f"  Sequence Length: {sequence_length}")
    print(f"  Prediction Interval: every {prediction_interval} frames")
    print(f"  Threshold: {threshold}")
    
    # 2. Load Model using predictor (reads paths from config)
    try:
        predictor = SignPredictor(config)
    except FileNotFoundError as e:
        logger.error(str(e))
        print(f"\n❌ {e}")
        print("\nTo train a model, run:")
        print("  1. Collect data: python record.py")
        print("  2. Train model: python -m model.train")
        return
    
    actions = predictor.classes
    logger.info(f"Model loaded with {len(actions)} classes: {list(actions)}")
    
    # 3. Setup Camera
    print(f"\nOpening camera {camera_index}...")
    cap = cv2.VideoCapture(camera_index)
    
    if not cap.isOpened():
        logger.error(f"Could not open camera at index {camera_index}")
        print(f"❌ Error: Could not open camera at index {camera_index}")
        print("   Please check your camera connection and config settings.")
        return
    
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, camera_width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, camera_height)
    
    # 4. Initialize Components (all read from config)
    detector = HolisticDetector(config)
    overlay = UIOverlay(config)
    fps_counter = FPSCounter()
    
    # Inference Variables
    sequence = []
    sentence = []
    predictions = []
    frame_num = 0
    
    print(f"\n✅ Inference started! Press 'q' to quit, 'c' to clear.")
    print(f"   Classes: {list(actions)}")
    logger.info("Inference loop started")
    
    try:
        while cap.isOpened():
            # Read frame
            ret, frame = cap.read()
            if not ret:
                logger.warning("Failed to read frame from camera")
                break
                
            frame_num += 1

            # Run detection using detector module
            image, results = detector.detect(frame)
            
            # Draw landmarks if enabled (from config)
            if show_landmarks:
                detector.draw_landmarks(image, results)
            
            # Update FPS
            fps_counter.update()
            overlay.draw_fps(image, fps_counter.get_fps())
            
            # Extract keypoints
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
            sequence = sequence[-sequence_length:]
            
            # Prediction logic (uses interval from config)
            if len(sequence) == sequence_length and frame_num % prediction_interval == 0:
                res = predictor.model.predict(np.expand_dims(sequence, axis=0), verbose=0)[0]
                predicted_action = actions[np.argmax(res)]
                logger.debug(f"Predicted: {predicted_action}")
                predictions.append(np.argmax(res))
                
                # Stability check
                if len(predictions) >= 2 and np.unique(predictions[-2:])[0] == np.argmax(res): 
                    if res[np.argmax(res)] > threshold: 
                        if len(sentence) > 0: 
                            if actions[np.argmax(res)] != sentence[-1]:
                                sentence = [actions[np.argmax(res)]]
                        else:
                            sentence = [actions[np.argmax(res)]]

                if len(sentence) > 1: 
                    sentence = sentence[-1:]
            
            # Draw header bar (color from config)
            cv2.rectangle(image, (0, 0), (image.shape[1], 40), header_color, -1)
            
            # Display detected sign
            display_text = ' '.join(sentence) if sentence else 'Waiting...'
            if display_text == 'Neutral':
                display_text = 'No sign detected'
                
            cv2.putText(image, display_text, (3, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
            
            # Show frame (window name from config)
            cv2.imshow(window_name, image)

            # Handle keyboard input
            key = cv2.waitKey(10) & 0xFF
            if key == ord('q'):
                logger.info("User requested exit")
                break
            elif key == ord('c'):
                sentence = []
                predictions = []
                sequence = []
                logger.info("Buffer cleared")
                
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
    finally:
        cap.release()
        cv2.destroyAllWindows()
        detector.close()
        logger.info("Inference stopped")
        print("\n👋 Inference stopped.")


if __name__ == '__main__':
    main()
