import cv2
import os

from detector.holistic_detector import HolisticDetector
from detector.keypoints import extract_keypoints
from ui.overlay import UIOverlay
from utils.fps_counter import FPSCounter
from utils.logger import setup_logger
from config.loader import ConfigLoader

# Try to import predictor (may not exist if model not trained)
try:
    from model.predictor import SignPredictor
    PREDICTOR_AVAILABLE = True
except ImportError:
    PREDICTOR_AVAILABLE = False


class SignLanguageDetector:
    def __init__(self):
        # Load config once
        self.config = ConfigLoader.load_config()
        
        # Setup logger with config
        self.logger = setup_logger(self.config)
        
        # Initialize predictor if model exists
        self.predictor = None
        self._init_predictor()
    
    def _init_predictor(self):
        """Try to load the trained model for predictions."""
        if not PREDICTOR_AVAILABLE:
            self.logger.warning("Predictor module not available")
            return
            
        model_path = "model/signlens.h5"
        metadata_path = "model/metadata.json"
        
        if os.path.exists(model_path) and os.path.exists(metadata_path):
            try:
                self.predictor = SignPredictor(model_path, metadata_path)
                self.logger.info(f"Loaded model with classes: {self.predictor.classes}")
            except Exception as e:
                self.logger.warning(f"Failed to load predictor: {e}")
                self.predictor = None
        else:
            self.logger.info("No trained model found. Running in detection-only mode.")
            self.logger.info("Train a model with: python -m model.train")

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

        # Initialize camera with error handling
        self.logger.info("Initializing camera...")
        try:
            cap = cv2.VideoCapture(self.config['camera']['index'])
            if not cap.isOpened():
                self.logger.error(f"Failed to open camera at index {self.config['camera']['index']}")
                print("ERROR: Could not open camera. Please check:")
                print("  1. Camera is connected")
                print("  2. Camera is not in use by another application")
                print("  3. Camera index in config.yaml is correct")
                return
        except Exception as e:
            self.logger.error(f"Camera initialization failed: {e}")
            print(f"ERROR: Camera initialization failed: {e}")
            return
            
        self.logger.info(f"Using camera index: {self.config['camera']['index']}")
        # Set camera resolution if specified
        if 'width' in self.config['camera'] and 'height' in self.config['camera']:
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.config['camera']['width'])
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.config['camera']['height'])
            self.logger.info(f"Using camera resolution: {self.config['camera']['width']}x{self.config['camera']['height']}")

        # Initialize UI
        ui = UIOverlay(self.config)
        
        # Prediction state
        last_prediction = None
        last_confidence = 0.0

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
            
            # Make prediction if model is loaded
            if self.predictor is not None:
                self.predictor.add_frame(keypoints)
                
                if self.predictor.can_predict():
                    pred_class, confidence = self.predictor.predict_with_threshold(threshold=0.6)
                    
                    if pred_class is not None:
                        last_prediction = pred_class
                        last_confidence = confidence
                
                # Draw prediction on screen
                if last_prediction is not None:
                    ui.draw_prediction(image, last_prediction, last_confidence)

            # Update FPS counter
            fps_counter.update()
            fps = fps_counter.get_fps()

            # Draw UI overlays
            ui.draw_fps(image, fps)
            
            # Update status based on mode
            if self.predictor is not None:
                status = "Recognition Active"
            else:
                status = "Detection Only (No Model)"
            ui.draw_status(image, status)

            # Display the resulting frame
            cv2.imshow('SignLens', image)

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
