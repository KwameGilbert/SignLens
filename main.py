import cv2
import os

from detector.holistic_detector import HolisticDetector
from detector.keypoints import extract_keypoints
from ui.overlay import UIOverlay
from utils.fps_counter import FPSCounter
from utils.logger import setup_logger
from config.loader import ConfigLoader

class SignLanguageDetector:
    def __init__(self):
        # Load config once
        self.config = ConfigLoader.load_config()
        
        # Setup logger with config
        self.logger = setup_logger(self.config)

    def main(self):
        self.logger.info(f"Starting {self.config['app']['name']}")
        self.logger.info(f"Version: {self.config['app']['version']}")
        self.logger.info(f"Loading {self.config['app']['name']}...")
       
       # Initialize detectors
        detector = HolisticDetector(self.config)
        fps_counter = FPSCounter()

        # Initialize camera
        cap = cv2.VideoCapture(self.config['camera']['index'])
        self.logger.info(f"Using camera index: {self.config['camera']['index']}")
        # Set camera resolution if specified
        if 'width' in self.config['camera'] and 'height' in self.config['camera']:
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.config['camera']['width'])
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.config['camera']['height'])
            self.logger.info(f"Using camera resolution: {self.config['camera']['width']}x{self.config['camera']['height']}")

        # Initialize UI
        ui = UIOverlay(self.config)

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Detect landmarks
            image, results = detector.detect(frame)

            # Draw landmarks
            detector.draw_landmarks(image, results)

            # Extract keypoints
            keypoints = extract_keypoints(results)

            # Update FPS counter
            fps_counter.update()
            fps = fps_counter.get_fps()

            # Draw UI overlays
            ui.draw_fps(image, fps)
            ui.draw_status(image, "Holistic Detection Active")

            # Display the resulting frame
            cv2.imshow('Holistic Detector', image)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        detector.close()
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    app = SignLanguageDetector()
    app.main()