import os
import shutil

# Source directory containing files named A-Z (e.g., A.mp4, B.mp4, ...)
source_dir = r'C:\Users\User\Desktop\images'
# Destination base directory
video_dataset_dir = os.path.join(os.path.dirname(__file__), '..', 'video', 'dataset_video')

# List of all alphabet letters (A-Z)
alphabet = [chr(i) for i in range(ord('A'), ord('Z')+1)]

for letter in alphabet:
    src_file = os.path.join(source_dir, f'{letter}.MOV')  # Change extension if needed
    dest_folder = os.path.join(video_dataset_dir, letter)
    dest_file = os.path.join(dest_folder, f'{letter}.MOV')

    # Ensure destination folder exists
    os.makedirs(dest_folder, exist_ok=True)

    # Copy if source exists and destination file does not exist
    if os.path.exists(src_file):
        if not os.path.exists(dest_file):
            shutil.copy2(src_file, dest_file)
            print(f"Copied {src_file} -> {dest_file}")
        else:
            print(f"Skipped {dest_file} (already exists)")
    else:
        print(f"Source file not found: {src_file}")

print("Done copying files.")
