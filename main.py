"""
SignLens Real-Time Inference
Main entry point for running sign language recognition on live webcam feed.

Usage:
    python main.py
"""

import cv2
import numpy as np
import os
import sys

from config.loader import ConfigLoader
from detector.holistic_detector import HolisticDetector
from detector.keypoints import extract_keypoints
from ui.overlay import UIOverlay
from utils.fps_counter import FPSCounter
from utils.logger import setup_logger
from model.predictor import SignPredictor


def main():
    """Main inference loop."""
    # 1. Load Configuration
    config = ConfigLoader.get_config()
    logger = setup_logger(config)
    
    # Get settings from config
    camera_index = config['camera']['index']
    camera_width = config['camera']['width']
    camera_height = config['camera']['height']
    
    inference_config = config.get('inference', {})
    threshold = inference_config.get('prediction_threshold', 0.5)
    prediction_interval = inference_config.get('prediction_interval', 5)
    stability_buffer = inference_config.get('stability_buffer', 2)
    
    ui_config = config.get('ui', {})
    window_name = ui_config.get('window_name', 'SignLens')
    show_landmarks = ui_config.get('show_landmarks', True)
    
    # Colors
    colors = [
        tuple(ui_config.get('colors', {}).get('primary', [245, 117, 16])),
        tuple(ui_config.get('colors', {}).get('secondary', [117, 245, 16])),
        tuple(ui_config.get('colors', {}).get('tertiary', [16, 117, 245]))
    ]
    
    logger.info("=" * 50)
    logger.info("SignLens Real-Time Inference")
    logger.info("=" * 50)
    
    print("=" * 50)
    print("  SignLens Real-Time Inference")
    print("=" * 50)
    
    # 2. Load Model
    try:
        predictor = SignPredictor(config=config)
    except FileNotFoundError as e:
        logger.error(str(e))
        print(f"\n❌ {e}")
        print("\nTo train a model, run:")
        print("  1. python record.py   (to collect data)")
        print("  2. python -m model.train   (to train the model)")
        return
    
    logger.info(f"Model loaded with {len(predictor.classes)} classes: {predictor.classes}")
    
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
    
    # 4. Initialize Components
    detector = HolisticDetector(config)
    overlay = UIOverlay(config)
    fps_counter = FPSCounter()
    
    # Inference Variables
    predictions_history = []
    current_sign = ""
    frame_num = 0
    
    print(f"\n✅ Inference started! Press 'q' to quit.")
    print(f"   Classes: {predictor.classes}")
    print(f"   Threshold: {threshold}")
    logger.info("Inference loop started")
    
    try:
        while cap.isOpened():
            # Read frame
            ret, frame = cap.read()
            if not ret:
                logger.warning("Failed to read frame from camera")
                break
                
            frame_num += 1

            # Run detection
            image, results = detector.detect(frame)
            
            # Draw landmarks if enabled
            if show_landmarks:
                detector.draw_landmarks(image, results)
            
            # Update FPS
            fps_counter.update()
            overlay.draw_fps(image, fps_counter.get_fps())
            
            # Extract keypoints and add to predictor buffer
            keypoints = extract_keypoints(results)
            predictor.add_frame(keypoints)
            
            # Run prediction at specified interval
            if predictor.can_predict() and frame_num % prediction_interval == 0:
                predicted_class, confidence = predictor.predict()
                predictions_history.append((predicted_class, confidence))
                
                # Keep only recent predictions for stability check
                predictions_history = predictions_history[-stability_buffer:]
                
                # Stability check: Only update if recent predictions agree
                if len(predictions_history) >= stability_buffer:
                    recent_classes = [p[0] for p in predictions_history]
                    if len(set(recent_classes)) == 1 and confidence > threshold:
                        current_sign = predicted_class
                        logger.debug(f"Detected: {current_sign} ({confidence:.2f})")
            
            # Draw header bar
            cv2.rectangle(image, (0, 0), (image.shape[1], 50), colors[0], -1)
            
            # Display detected sign
            display_text = current_sign if current_sign else "Waiting..."
            if display_text == 'Neutral':
                display_text = 'No sign detected'
                
            cv2.putText(
                image, 
                display_text, 
                (10, 35), 
                cv2.FONT_HERSHEY_SIMPLEX, 
                1.2, 
                (255, 255, 255), 
                2, 
                cv2.LINE_AA
            )
            
            # Draw buffer status
            buffer_status = predictor.get_buffer_status()
            status_text = f"Buffer: {buffer_status['buffer_size']}/{buffer_status['sequence_length']}"
            cv2.putText(
                image,
                status_text,
                (image.shape[1] - 150, 35),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),
                1,
                cv2.LINE_AA
            )
            
            # Show frame
            cv2.imshow(window_name, image)

            # Handle keyboard input
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                logger.info("User requested exit")
                break
            elif key == ord('c'):
                # Clear current detection
                current_sign = ""
                predictions_history = []
                predictor.clear_buffer()
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
