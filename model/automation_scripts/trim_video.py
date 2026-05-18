"""
SignLens Video Trimming Script
==============================
This script cuts a video into multiple clips based on specified timelines (timestamps).
It automatically detects video properties (FPS, resolution, codec) and performs 
frame-accurate trimming.

Usage:
1. Place your video file (e.g. 'input.mp4') in the same directory as this script.
2. Edit the variables `VIDEO_NAME` and `TIMELINES` below.
3. Run the script: python trim_video.py
"""

import os
import cv2

# ==========================================
# CONFIGURATION
# ==========================================
# Name of the input video file (located in the same directory as this script).
# If left empty, the script will automatically detect the first video file in this directory.
VIDEO_NAME = "ASL Manual Alphabet _ Start ASL.mp4" 

# List of timelines (clips) to extract.
# Supported formats:
# - Seconds as integer/float: 10, 15.5
# - MM:SS string: "0:05", "1:30"
# - HH:MM:SS string: "0:01:20"
#
# Examples:
# [("A_Front", "0:05", "0:07"), ("A_Side", "0:48", "0:49.5")]
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

# Output folder name (created inside the script's directory)
OUTPUT_DIR_NAME = "trimmed_clips"
# ==========================================

def parse_time(time_val):
    """Converts seconds, MM:SS, or HH:MM:SS to a float of total seconds."""
    if isinstance(time_val, (int, float)):
        return float(time_val)
    
    time_str = str(time_val).strip()
    
    # Try parsing parts separated by ':'
    parts = time_str.split(':')
    try:
        if len(parts) == 1:
            return float(parts[0])
        elif len(parts) == 2:
            minutes = float(parts[0])
            seconds = float(parts[1])
            return minutes * 60 + seconds
        elif len(parts) == 3:
            hours = float(parts[0])
            minutes = float(parts[1])
            seconds = float(parts[2])
            return hours * 3600 + minutes * 60 + seconds
        else:
            raise ValueError(f"Invalid timestamp format: {time_str}")
    except ValueError as e:
        print(f"[-] Error parsing time '{time_str}': {e}")
        raise

def format_seconds(seconds):
    """Formats float seconds into a clean H:M:S.cs string for filenames/logs."""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    cs = int(round((seconds - int(seconds)) * 100))
    if h > 0:
        return f"{h:02d}h{m:02d}m{s:02d}s{cs:02d}"
    elif m > 0:
        return f"{m:02d}m{s:02d}s{cs:02d}"
    else:
        return f"{s:02d}s{cs:02d}"

def trim_video(video_path, start_time_str, end_time_str, clip_index, output_dir):
    start_sec = parse_time(start_time_str)
    end_sec = parse_time(end_time_str)
    
    if start_sec >= end_sec:
        print(f"[-] Clip {clip_index}: Invalid range ({start_time_str} to {end_time_str}). Start time must be before end time.")
        return False

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"[-] Error: Could not open source video: {video_path}")
        return False

    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps if fps > 0 else 0

    if start_sec > duration:
        print(f"[-] Clip {clip_index}: Start time ({start_time_str}) exceeds video duration ({duration:.2f}s). Skipping.")
        cap.release()
        return False

    # Calculate frame indices
    start_frame = int(start_sec * fps)
    end_frame = int(end_sec * fps)
    
    if end_frame > total_frames:
        end_frame = total_frames
        end_sec = duration

    # Format output file name
    base_name = os.path.splitext(os.path.basename(video_path))[0]
    start_fmt = format_seconds(start_sec)
    end_fmt = format_seconds(end_sec)
    out_filename = f"{base_name}_clip{clip_index}_{start_fmt}_to_{end_fmt}.mp4"
    out_path = os.path.join(output_dir, out_filename)

    # Use standard mp4v codec for excellent compatibility
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(out_path, fourcc, fps, (width, height))

    print(f"[+] Extracting Clip {clip_index}: {start_time_str} -> {end_time_str} ({start_sec:.2f}s to {end_sec:.2f}s)")
    
    # Try instant seeking
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    actual_frame = int(cap.get(cv2.CAP_PROP_POS_FRAMES))

    # If seeking was inaccurate, read frames sequentially up to the start frame
    if actual_frame != start_frame:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        for _ in range(start_frame):
            ret, _ = cap.read()
            if not ret:
                break

    # Write frames to the output file
    current_frame = start_frame
    frames_written = 0
    
    while current_frame < end_frame:
        ret, frame = cap.read()
        if not ret:
            break
        out.write(frame)
        current_frame += 1
        frames_written += 1

    cap.release()
    out.release()

    if frames_written > 0:
        print(f"    -> Saved: {out_filename} ({frames_written} frames, {frames_written/fps:.2f}s)")
        return True
    else:
        print(f"    -> Failed: No frames were written for Clip {clip_index}.")
        if os.path.exists(out_path):
            os.remove(out_path)
        return False

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Find input video file
    video_file = VIDEO_NAME.strip()
    if not video_file:
        # Auto-detect first video file in script folder
        supported_exts = ('.mp4', '.mov', '.avi', '.mkv', '.webm')
        videos = [f for f in os.listdir(script_dir) if f.lower().endswith(supported_exts)]
        if not videos:
            print("[-] Error: No video files found in the script directory.")
            print("    Please place a video file (e.g., .mp4, .mov) here or configure VIDEO_NAME.")
            return
        video_file = videos[0]
        print(f"[*] Auto-detected video file: '{video_file}'")

    video_path = os.path.join(script_dir, video_file)
    if not os.path.exists(video_path):
        print(f"[-] Error: Video file not found: {video_path}")
        return

    # Create output directory
    output_dir = os.path.join(script_dir, OUTPUT_DIR_NAME)
    os.makedirs(output_dir, exist_ok=True)
    print(f"[*] Output directory: '{output_dir}'")

    # Process all clips
    print(f"[*] Processing {len(TIMELINES)} clips from '{video_file}'...")
    success_count = 0
    for idx, item in enumerate(TIMELINES, start=1):
        if len(item) == 3:
            label, start, end = item
        else:
            start, end = item
            label = f"clip{idx}"
        if trim_video(video_path, start, end, label, output_dir):
            success_count += 1

    print(f"\n[+] Completed! Successfully extracted {success_count}/{len(TIMELINES)} clips.")

if __name__ == "__main__":
    main()
