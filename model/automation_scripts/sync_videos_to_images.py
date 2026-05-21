"""
SignLens Video-Image Sync Script
================================
This script cleans up the video dataset by aligning it with the manually cleaned-up
image dataset. It reads the images currently present in `model/image/dataset_images/`,
identifies which frames they represent in the original video, and extracts only 
those specific segments into the corresponding video folders.

This ensures that any "dirty" frames (other classes or stationary segments) that 
were removed from the image dataset are also removed from the video dataset.
"""

import os
import cv2
import re

# ==========================================
# CONFIGURATION
# ==========================================
VIDEO_NAME = "ASL Manual Alphabet _ Start ASL.mp4"
FRAME_STEP = 3
FPS = 30.0

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_DATASET_DIR = os.path.join(SCRIPT_DIR, '..', 'image', 'dataset_images')
VIDEO_DATASET_DIR = os.path.join(SCRIPT_DIR, '..', 'video', 'dataset_video')
SOURCE_VIDEO_PATH = os.path.join(SCRIPT_DIR, VIDEO_NAME)

# TIMELINES from generate_dataset.py
TIMELINES = [
    ("A_Front", "0:05", "0:07"), ("A_Side", "0:48", "0:49.5"),
    ("B_Front", "0:07", "0:08"), ("B_Side", "0:49", "0:51"),
    ("C_Front", "0:08", "0:10"), ("C_Side", "0:51", "0:53"),
    ("D_Front", "0:10", "0:11.5"), ("D_Side", "0:53", "0:54.5"),
    ("E_Front", "0:11", "0:13"), ("E_Side", "0:54", "0:56"),
    ("F_Front", "0:13", "0:15"), ("F_Side", "0:56", "0:57.5"),
    ("G_Front", "0:15", "0:17"), ("G_Side", "0:57", "0:59"),
    ("H_Front", "0:17", "0:18.5"), ("H_Side", "0:59", "1:00.5"),
    ("I_Front", "0:18", "0:20"), ("I_Side", "1:00", "1:02"),
    ("J_Front", "0:20", "0:22"), ("J_Side", "1:02", "1:04"),
    ("K_Front", "0:22", "0:23.5"), ("K_Side", "1:04", "1:06"),
    ("L_Front", "0:23", "0:25"), ("L_Side", "1:06", "1:07.5"),
    ("M_Front", "0:25", "0:26.5"), ("M_Side", "1:07", "1:09"),
    ("N_Front", "0:26", "0:28"), ("N_Side", "1:09", "1:10.5"),
    ("O_Front", "0:28", "0:29.5"), ("O_Side", "1:10", "1:12"),
    ("P_Front", "0:29", "0:31"), ("P_Side", "1:12", "1:13.5"),
    ("Q_Front", "0:31", "0:33"), ("Q_Side", "1:13", "1:15"),
    ("R_Front", "0:33", "0:34.5"), ("R_Side", "1:15", "1:17"),
    ("S_Front", "0:34", "0:36"), ("S_Side", "1:17", "1:18.5"),
    ("T_Front", "0:36", "0:37.5"), ("T_Side", "1:18", "1:20"),
    ("U_Front", "0:37", "0:39"), ("U_Side", "1:20", "1:21.5"),
    ("V_Front", "0:39", "0:40.5"), ("V_Side", "1:21", "1:23"),
    ("W_Front", "0:40", "0:42"), ("W_Side", "1:23", "1:24.5"),
    ("X_Front", "0:42", "0:43.5"), ("X_Side", "1:24", "1:25.5"),
    ("Y_Front", "0:43", "0:44.5"), ("Y_Side", "1:25", "1:27"),
    ("Z_Front", "0:44", "0:47"), ("Z_Side", "1:27", "1:29"),
]

# ==========================================

def parse_time(time_val):
    if isinstance(time_val, (int, float)):
        return float(time_val)
    parts = str(time_val).strip().split(':')
    if len(parts) == 2:
        return float(parts[0]) * 60 + float(parts[1])
    elif len(parts) == 3:
        return float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
    return float(parts[0])

def get_contiguous_blocks(indices):
    if not indices: return []
    indices = sorted(indices)
    blocks = []
    current_block = [indices[0]]
    for i in range(1, len(indices)):
        if indices[i] == indices[i-1] + 1:
            current_block.append(indices[i])
        else:
            blocks.append(current_block)
            current_block = [indices[i]]
    blocks.append(current_block)
    return blocks

def main():
    if not os.path.exists(SOURCE_VIDEO_PATH):
        print(f"[-] Source video not found: {SOURCE_VIDEO_PATH}")
        return

    # Map labels to their start second
    label_to_start_sec = {label: parse_time(start) for label, start, end in TIMELINES}

    # Backup existing video dataset folder
    if os.path.exists(VIDEO_DATASET_DIR):
        print("[*] Backing up existing video dataset...")
        import shutil
        backup_path = VIDEO_DATASET_DIR + "_backup"
        if os.path.exists(backup_path):
            shutil.rmtree(backup_path)
        shutil.move(VIDEO_DATASET_DIR, backup_path)
    
    os.makedirs(VIDEO_DATASET_DIR, exist_ok=True)

    cap = cv2.VideoCapture(SOURCE_VIDEO_PATH)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')

    print("[*] Syncing videos to manually cleaned images...")

    for class_folder in os.listdir(IMAGE_DATASET_DIR):
        class_path = os.path.join(IMAGE_DATASET_DIR, class_folder)
        if not os.path.isdir(class_path): continue

        print(f"[*] Processing Class: {class_folder}")
        
        # Dictionary to store labels and their frame indices found in this folder
        # label -> list of indices
        label_groups = {}
        
        for file in os.listdir(class_path):
            # Regex to match label_frame_index.jpg
            match = re.search(r"(.+)_frame_(\d+)\.jpg", file)
            if match:
                label = match.group(1)
                idx = int(match.group(2))
                if label not in label_groups:
                    label_groups[label] = []
                label_groups[label].append(idx)
        
        if not label_groups:
            continue

        # Create target video dir for this class
        target_video_class_dir = os.path.join(VIDEO_DATASET_DIR, class_folder)
        os.makedirs(target_video_class_dir, exist_ok=True)

        for label, indices in label_groups.items():
            if label not in label_to_start_sec:
                print(f"    [!] Warning: Label '{label}' not found in TIMELINES. Skipping.")
                continue

            blocks = get_contiguous_blocks(indices)
            base_start_sec = label_to_start_sec[label]

            for b_idx, block in enumerate(blocks):
                # Calculate start/end frames relative to the original clip start
                offset_start_frames = block[0] * FRAME_STEP
                offset_end_frames = (block[-1] * FRAME_STEP) + FRAME_STEP
                
                # Absolute frames in the source video
                abs_start_frame = int(base_start_sec * FPS) + offset_start_frames
                abs_end_frame = int(base_start_sec * FPS) + offset_end_frames

                # Extract and save video
                out_name = f"{label}_sync_{b_idx}.mp4"
                out_path = os.path.join(target_video_class_dir, out_name)
                writer = cv2.VideoWriter(out_path, fourcc, FPS, (width, height))

                cap.set(cv2.CAP_PROP_POS_FRAMES, abs_start_frame)
                
                for _ in range(abs_start_frame, abs_end_frame):
                    ret, frame = cap.read()
                    if not ret: break
                    writer.write(frame)
                
                writer.release()
                print(f"    [+] Saved sync clip: {class_folder}/{out_name} ({abs_end_frame - abs_start_frame} frames)")

    cap.release()
    print("\n[+] Done! Video dataset is now perfectly synced with cleaned images.")

if __name__ == "__main__":
    main()
