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
        self.logger.info("Loading Mediapipe Model...")
        detector = HolisticDetector(self.config)
        self.logger.info("Holistic Model Loaded...")
        self.logger.info("Loading FPS Counter...")
        fps_counter = FPSCounter()
        self.logger.info("FPS Counter Loaded...")

        # Initialize camera
        self.logger.info("Initializing camera...")
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

            # Check for config updates
            if ConfigLoader.check_for_updates():
                self.logger.info("Configuration change detected. Reloading...")
                self.config = ConfigLoader.reload_config()
                
                # Update components
                ui.update_config(self.config)
                detector.update_config(self.config)
                
                # Update logger level
                log_level = self.config.get('logging', {}).get('level', 'INFO').upper()
                self.logger.setLevel(log_level)
                for handler in self.logger.handlers:
                    handler.setLevel(log_level)
                
                # Update camera resolution if changed
                new_width = self.config['camera'].get('width')
                new_height = self.config['camera'].get('height')
                current_width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
                current_height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
                
                if new_width and new_height and (new_width != current_width or new_height != current_height):
                    self.logger.info(f"Updating camera resolution to {new_width}x{new_height}")
                    cap.set(cv2.CAP_PROP_FRAME_WIDTH, new_width)
                    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, new_height)
        
        self.logger.info("Closing camera and releasing resources...")
        detector.close()
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    app = SignLanguageDetector()
    app.main()