"""
SignLens Data Collection Tool
Captures sign language gesture sequences from webcam and saves as keypoint arrays.
"""

import cv2
import numpy as np
import os
import shutil

from config import ConfigLoader
from detector import HolisticDetector, extract_keypoints
from ui import UIOverlay
from utils import FPSCounter, setup_logger


def main():
    # 1. Load Configuration
    config = ConfigLoader.get_config()
    logger = setup_logger(config)
    
    # Get settings from config
    data_path = config['data_collection']['data_path']
    sequence_length = config['data_collection']['sequence_length']
    num_sequences = config['data_collection']['num_sequences']
    camera_index = config['camera']['index']
    window_name = config['ui'].get('window_name', 'SignLens')
    
    logger.info("=" * 50)
    logger.info("SignLens Data Collection Tool")
    logger.info("=" * 50)
    
    print("=" * 50)
    print("SignLens Data Collection Tool")
    print("=" * 50)
    
    # 2. Ask for the action (sign) to record
    action = input("Enter the name of the sign you want to collect (e.g., 'A'): ").strip()
    if not action:
        logger.error("Invalid name. Exiting.")
        print("Invalid name. Exiting.")
        return

    # 3. Create directory for the action
    action_path = os.path.join(data_path, action)
    if os.path.exists(action_path):
        shutil.rmtree(action_path)
    os.makedirs(action_path)
    
    logger.info(f"Saving data to: {action_path}")
    logger.info(f"Recording {num_sequences} sequences of {sequence_length} frames each.")
    print(f"Saving data to: {action_path}")
    print(f"Please prepare to record {num_sequences} sequences of {sequence_length} frames each.")

    # 4. Setup Camera
    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        logger.error("Could not open webcam.")
        print("Error: Could not open webcam.")
        return
    
    # Set camera resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, config['camera']['width'])
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, config['camera']['height'])
    
    # 5. Initialize Components
    detector = HolisticDetector(config)
    overlay = UIOverlay(config)
    fps_counter = FPSCounter()
    
    try:
        # 6. Start Collection
        for sequence in range(num_sequences):
            sequence_frames = []  # Collect frames for this sequence

            # Loop through video length (sequence length)
            for frame_num in range(sequence_length):
                # Read feed
                ret, frame = cap.read()
                if not ret:
                    logger.error("Error reading frame.")
                    print("Error reading frame.")
                    break

                # Make detections
                image, results = detector.detect(frame)

                # Draw landmarks if enabled
                if config['ui'].get('show_landmarks', True):
                    detector.draw_landmarks(image, results)
                
                # Update FPS
                fps_counter.update()
                overlay.draw_fps(image, fps_counter.get_fps())
                
                # Apply wait logic (Give user a break between sequences)
                if frame_num == 0:
                    cv2.putText(image, 'STARTING COLLECTION', (120, 200), 
                               cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 4, cv2.LINE_AA)
                    cv2.putText(image, f'Collecting {action} Video Number {sequence}', (15, 12), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)
                    cv2.imshow(window_name, image)
                    cv2.waitKey(1000)  # Wait 1 second
                else: 
                    cv2.putText(image, f'Collecting {action} Video Number {sequence}', (15, 12), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)
                    cv2.imshow(window_name, image)
                
                # Extract and store keypoints
                keypoints = extract_keypoints(results)
                sequence_frames.append(keypoints)

                # Break gracefully on 'q'
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    logger.info("User requested exit.")
                    cap.release()
                    cv2.destroyAllWindows()
                    detector.close()
                    return

            # Save the sequence
            npy_path = os.path.join(action_path, str(sequence))
            np.save(npy_path, np.array(sequence_frames))
            logger.info(f"Saved sequence {sequence} to {npy_path}.npy")
            print(f"Saved sequence {sequence} to {npy_path}.npy")

    finally:
        cap.release()
        cv2.destroyAllWindows()
        detector.close()
        logger.info("Data collection complete.")
        print("Data collection complete.")


if __name__ == '__main__':
    try:
        print("Script started successfully!")
        main()
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        input("Press Enter to exit...")
