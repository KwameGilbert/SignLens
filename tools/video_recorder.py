import cv2
import numpy as np
import os
from detector.holistic_detector import HolisticDetector
from detector.keypoints import extract_keypoints
from rich.progress import Progress

class VideoRecorder:
    def __init__(self, config, recorder_config):
        self.config = config
        self.rec_config = recorder_config
        self.output_dir = recorder_config['output_dir']
        self.detector = HolisticDetector(config)

    def process_video(self, video_path, class_name):
        cap = cv2.VideoCapture(video_path)
        sequence = []
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            # Detect
            image, results = self.detector.detect(frame)
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
            
        cap.release()
        return sequence

    def run(self):
        # For video recorder, we might need a source directory input
        # Since the menu didn't explicitly ask for "Source Video Directory", 
        # we'll ask for it here or assume a default structure.
        # Let's use a simple input for now or check config.
        
        # In a real app, we'd add this to the menu. For now, let's assume 
        # the user puts videos in a 'raw_data' folder or we ask via input.
        
        print("Video Recorder Mode")
        source_dir = input("Enter path to raw video directory (containing class subfolders): ").strip()
        
        if not os.path.exists(source_dir):
            print(f"Directory {source_dir} does not exist.")
            return

        # Iterate over class folders
        class_folders = [d for d in os.listdir(source_dir) if os.path.isdir(os.path.join(source_dir, d))]
        
        with Progress() as progress:
            overall_task = progress.add_task("[green]Processing Classes...", total=len(class_folders))
            
            for class_name in class_folders:
                class_path = os.path.join(source_dir, class_name)
                output_class_dir = os.path.join(self.output_dir, class_name)
                os.makedirs(output_class_dir, exist_ok=True)
                
                videos = [f for f in os.listdir(class_path) if f.endswith(('.mp4', '.avi', '.mov'))]
                
                class_task = progress.add_task(f"Processing {class_name}", total=len(videos))
                
                for vid_file in videos:
                    vid_path = os.path.join(class_path, vid_file)
                    sequence = self.process_video(vid_path, class_name)
                    
                    if sequence:
                        # Save
                        existing = len([f for f in os.listdir(output_class_dir) if f.endswith('.npy')])
                        save_path = os.path.join(output_class_dir, f"seq_{existing:03d}.npy")
                        np.save(save_path, np.array(sequence))
                        
                    progress.advance(class_task)
                
                progress.advance(overall_task)
                
        self.detector.close()
        print("Video processing complete.")
