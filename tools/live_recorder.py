import cv2
import numpy as np
import os
import time
from detector.holistic_detector import HolisticDetector
from detector.keypoints import extract_keypoints
from ui.overlay import UIOverlay
from utils.fps_counter import FPSCounter

class LiveRecorder:
    def __init__(self, config, recorder_config):
        self.config = config
        self.rec_config = recorder_config
        
        self.output_dir = recorder_config['output_dir']
        self.classes = recorder_config['classes']
        self.mode = recorder_config['mode']
        self.seq_len = recorder_config['sequence_length']
        self.gesture_type = recorder_config['gesture_type']
        
        self.detector = HolisticDetector(config)
        self.ui = UIOverlay(config)
        self.fps_counter = FPSCounter()
        
        self.current_class_idx = 0
        self.is_recording = False
        self.sequence_buffer = []
        self.frame_count = 0
        
        # Auto/Hybrid mode settings
        self.countdown_duration = config['dataset']['recording']['countdown']
        self.last_action_time = 0
        self.state = "IDLE" # IDLE, COUNTDOWN, RECORDING
        self.countdown_start = 0

    def get_save_path(self, class_name):
        class_dir = os.path.join(self.output_dir, class_name)
        os.makedirs(class_dir, exist_ok=True)
        
        # Find next sequence number
        existing_files = [f for f in os.listdir(class_dir) if f.endswith('.npy')]
        seq_num = len(existing_files)
        return os.path.join(class_dir, f"seq_{seq_num:03d}.npy")

    def save_sequence(self):
        if not self.sequence_buffer:
            return
            
        class_name = self.classes[self.current_class_idx]
        save_path = self.get_save_path(class_name)
        
        # Handle static vs dynamic length
        # If static, we might just take the last frame or average, 
        # but the plan says "static length (default 3 frames)".
        # So we just save whatever we collected up to seq_len.
        
        data = np.array(self.sequence_buffer)
        np.save(save_path, data)
        print(f"Saved {class_name} sequence to {save_path} (Shape: {data.shape})")
        self.sequence_buffer = []

    def draw_recorder_ui(self, image, class_name):
        # Top center: Current Class
        cv2.putText(image, f"Class: {class_name} ({self.current_class_idx + 1}/{len(self.classes)})",
                    (int(image.shape[1]/2) - 100, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)
        
        # Bottom center: Instructions
        if self.mode == "keyboard":
            instr = "R: Record | S: Stop/Save | N: Next Class | Q: Quit"
        elif self.mode == "auto":
            instr = "Auto-Recording Mode | Q: Quit"
        else:
            instr = "Hybrid Mode | S: Stop/Save | N: Next | Q: Quit"
            
        cv2.putText(image, instr,
                    (50, image.shape[0] - 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

        # State indicators
        if self.state == "COUNTDOWN":
            elapsed = time.time() - self.countdown_start
            remaining = int(self.countdown_duration - elapsed) + 1
            cv2.putText(image, f"GET READY: {remaining}",
                        (int(image.shape[1]/2) - 50, int(image.shape[0]/2)),
                        cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 165, 255), 4)
                        
        elif self.state == "RECORDING":
            cv2.circle(image, (30, 30), 10, (0, 0, 255), -1)
            cv2.putText(image, "REC", (50, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.putText(image, f"{len(self.sequence_buffer)}/{self.seq_len}",
                        (int(image.shape[1]/2) - 30, int(image.shape[0]/2) + 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    def run(self):
        # Initialize camera 
        try:
            cap = cv2.VideoCapture(self.config['camera']['index'])
            if not cap.isOpened():
                print(f"ERROR: Could not open camera at index {self.config['camera']['index']}")
                print("Please check your camera connection and config settings.")
                return
        except Exception as e:
            print(f"ERROR: Camera initialization failed: {e}")
            return
            
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.config['camera']['width'])
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.config['camera']['height'])

        # Initial state for auto modes
        if self.mode in ["auto", "hybrid"]:
            self.state = "COUNTDOWN"
            self.countdown_start = time.time()

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Detection
            image, results = self.detector.detect(frame)
            self.detector.draw_landmarks(image, results)
            keypoints = extract_keypoints(results)
            
            # FPS
            self.fps_counter.update()
            self.ui.draw_fps(image, self.fps_counter.get_fps())
            
            # Logic based on state
            if self.state == "COUNTDOWN":
                if time.time() - self.countdown_start > self.countdown_duration:
                    self.state = "RECORDING"
                    self.sequence_buffer = []
                    
            elif self.state == "RECORDING":
                self.sequence_buffer.append(keypoints)
                
                # Auto-stop conditions
                if self.mode == "auto" and len(self.sequence_buffer) >= self.seq_len:
                    self.save_sequence()
                    self.state = "COUNTDOWN"
                    self.countdown_start = time.time()
                
                # Auto-stop in keyboard mode when buffer is full
                if self.mode == "keyboard" and len(self.sequence_buffer) >= self.seq_len:
                    self.save_sequence()
                    self.state = "IDLE"
                    print(f"Auto-saved: buffer reached {self.seq_len} frames")

            # Draw UI
            class_name = self.classes[self.current_class_idx]
            self.draw_recorder_ui(image, class_name)
            
            cv2.imshow('SignLens Recorder', image)
            
            # Input Handling
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord('q'):
                break
            
            if self.mode == "keyboard":
                if key == ord('r'):
                    self.state = "RECORDING"
                    self.sequence_buffer = []
                elif key == ord('s'):
                    if self.state == "RECORDING":
                        self.save_sequence()
                        self.state = "IDLE"
                elif key == ord('n'):
                    self.current_class_idx = (self.current_class_idx + 1) % len(self.classes)
                    self.state = "IDLE"
                    
            elif self.mode == "hybrid":
                if key == ord('s'): # Manual stop
                    self.save_sequence()
                    self.state = "COUNTDOWN"
                    self.countdown_start = time.time()
                elif key == ord('n'): # Next class
                    self.current_class_idx = (self.current_class_idx + 1) % len(self.classes)
                    self.state = "COUNTDOWN"
                    self.countdown_start = time.time()

        cap.release()
        cv2.destroyAllWindows()
        self.detector.close()
