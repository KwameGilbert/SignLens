"""
SignLens Complete Dataset Generator
====================================
This script processes the ASL Manual Alphabet video to generate both:
1. Video Dataset: Cuts the video into individual letter clips (front and side views) 
   and places them directly in `model/video/dataset_video/{letter}/`.
2. Image Dataset: Extracts frames from those clips and saves them directly in 
   `model/image/dataset_images/{letter}/` to train the image classification model.

Usage:
Simply run: python model/automation_scripts/generate_dataset.py
"""

import os
import cv2

# ==========================================
# CONFIGURATION
# ==========================================
# Input video file name inside the same directory
VIDEO_NAME = "ASL Manual Alphabet _ Start ASL.mp4"

# Interval of frames to save as images (e.g., 3 means save every 3rd frame)
FRAME_STEP = 3

# Define target dataset folders (relative to this script)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEO_DATASET_DIR = os.path.join(SCRIPT_DIR, '..', 'video', 'dataset_video')
IMAGE_DATASET_DIR = os.path.join(SCRIPT_DIR, '..', 'image', 'dataset_images')

# Precise timelines for the ASL manual alphabet
TIMELINES = [
    # Format: ("Label", "Start_Time", "End_Time")
    ("A_Front", "0:05", "0:07"),
    ("A_Side", "0:48", "0:49.5"),
    ("B_Front", "0:07", "0:08"),
    ("B_Side", "0:49", "0:51"),
    ("C_Front", "0:08", "0:10"),
    ("C_Side", "0:51", "0:53"),
    ("D_Front", "0:10", "0:11.5"),
    ("D_Side", "0:53", "0:54.5"),
    ("E_Front", "0:11", "0:13"),
    ("E_Side", "0:54", "0:56"),
    ("F_Front", "0:13", "0:15"),
    ("F_Side", "0:56", "0:57.5"),
    ("G_Front", "0:15", "0:17"),
    ("G_Side", "0:57", "0:59"),
    ("H_Front", "0:17", "0:18.5"),
    ("H_Side", "0:59", "1:00.5"),
    ("I_Front", "0:18", "0:20"),
    ("I_Side", "1:00", "1:02"),
    ("J_Front", "0:20", "0:22"),
    ("J_Side", "1:02", "1:04"),
    ("K_Front", "0:22", "0:23.5"),
    ("K_Side", "1:04", "1:06"),
    ("L_Front", "0:23", "0:25"),
    ("L_Side", "1:06", "1:07.5"),
    ("M_Front", "0:25", "0:26.5"),
    ("M_Side", "1:07", "1:09"),
    ("N_Front", "0:26", "0:28"),
    ("N_Side", "1:09", "1:10.5"),
    ("O_Front", "0:28", "0:29.5"),
    ("O_Side", "1:10", "1:12"),
    ("P_Front", "0:29", "0:31"),
    ("P_Side", "1:12", "1:13.5"),
    ("Q_Front", "0:31", "0:33"),
    ("Q_Side", "1:13", "1:15"),
    ("R_Front", "0:33", "0:34.5"),
    ("R_Side", "1:15", "1:17"),
    ("S_Front", "0:34", "0:36"),
    ("S_Side", "1:17", "1:18.5"),
    ("T_Front", "0:36", "0:37.5"),
    ("T_Side", "1:18", "1:20"),
    ("U_Front", "0:37", "0:39"),
    ("U_Side", "1:20", "1:21.5"),
    ("V_Front", "0:39", "0:40.5"),
    ("V_Side", "1:21", "1:23"),
    ("W_Front", "0:40", "0:42"),
    ("W_Side", "1:23", "1:24.5"),
    ("X_Front", "0:42", "0:43.5"),
    ("X_Side", "1:24", "1:25.5"),
    ("Y_Front", "0:43", "0:44.5"),
    ("Y_Side", "1:25", "1:27"),
    ("Z_Front", "0:44", "0:47"),
    ("Z_Side", "1:27", "1:29"),
]
# ==========================================

def parse_time(time_val):
    if isinstance(time_val, (int, float)):
        return float(time_val)
    parts = str(time_val).strip().split(':')
    if len(parts) == 1:
        return float(parts[0])
    elif len(parts) == 2:
        return float(parts[0]) * 60 + float(parts[1])
    elif len(parts) == 3:
        return float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
    raise ValueError(f"Invalid timestamp: {time_val}")

def process_clip(video_path, label, start_time_str, end_time_str):
    # Determine the class letter from the label (e.g. "A_Front" -> "A")
    class_letter = label.split('_')[0]
    
    # Establish and create direct target directories
    class_video_dir = os.path.join(VIDEO_DATASET_DIR, class_letter)
    class_image_dir = os.path.join(IMAGE_DATASET_DIR, class_letter)
    os.makedirs(class_video_dir, exist_ok=True)
    os.makedirs(class_image_dir, exist_ok=True)
    
    start_sec = parse_time(start_time_str)
    end_sec = parse_time(end_time_str)
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"[-] Error opening video: {video_path}")
        return False
        
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps if fps > 0 else 0
    
    if start_sec > duration:
        cap.release()
        return False
        
    start_frame = int(start_sec * fps)
    end_frame = int(end_sec * fps)
    if end_frame > total_frames:
        end_frame = total_frames
        
    # Define filenames
    video_out_name = f"{label}.mp4"
    video_out_path = os.path.join(class_video_dir, video_out_name)
    
    # Setup video writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_out_path, fourcc, fps, (width, height))
    
    # Seek to start
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    actual_frame = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
    if actual_frame != start_frame:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        for _ in range(start_frame):
            cap.read()
            
    # Process frames
    current_frame = start_frame
    frames_written = 0
    images_saved = 0
    
    while current_frame < end_frame:
        ret, frame = cap.read()
        if not ret:
            break
            
        # Write to video
        out.write(frame)
        frames_written += 1
        
        # Extract and save image frame at step interval
        if (current_frame - start_frame) % FRAME_STEP == 0:
            img_name = f"{label}_frame_{images_saved:03d}.jpg"
            img_path = os.path.join(class_image_dir, img_name)
            cv2.imwrite(img_path, frame)
            images_saved += 1
            
        current_frame += 1
        
    cap.release()
    out.release()
    
    print(f"[+] Class {class_letter} ({label}):")
    print(f"    -> Saved Video: {video_out_name} ({frames_written} frames)")
    print(f"    -> Extracted Images: {images_saved} frames saved to '{class_letter}/'")
    return True

def main():
    video_path = os.path.join(SCRIPT_DIR, VIDEO_NAME)
    if not os.path.exists(video_path):
        print(f"[-] Video file not found: {video_path}")
        return
        
    print(f"[*] Starting Dataset Generation Pipeline...")
    print(f"[*] Input Video: {VIDEO_NAME}")
    print(f"[*] Frame step for image extraction: {FRAME_STEP} (Extract 1 image every {FRAME_STEP} frames)")
    print(f"[*] Video Dataset Target: {VIDEO_DATASET_DIR}")
    print(f"[*] Image Dataset Target: {IMAGE_DATASET_DIR}\n")
    
    success = 0
    for label, start, end in TIMELINES:
        if process_clip(video_path, label, start, end):
            success += 1
            
    print(f"\n[+] Pipeline Complete! Successfully processed {success}/{len(TIMELINES)} clips.")

if __name__ == "__main__":
    main()
