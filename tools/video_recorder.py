"""
Media Recorder for SignLens
Processes both videos AND images from a source directory.
- Videos: Extracts keypoints from all frames
- Images: Extracts keypoints and creates sequences (for static signs)
"""
import cv2
import numpy as np
import os
from detector.holistic_detector import HolisticDetector
from detector.keypoints import extract_keypoints
from rich.progress import Progress
from rich.console import Console

console = Console()

# Supported file extensions
VIDEO_EXTENSIONS = ('.mp4', '.avi', '.mov', '.mkv', '.webm')
IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.bmp', '.webp')


class MediaRecorder:
    """Processes videos and images to extract keypoint sequences."""
    
    def __init__(self, config, recorder_config):
        self.config = config
        self.rec_config = recorder_config
        self.output_dir = recorder_config.get('output_dir', 'dataset')
        self.sequence_length = recorder_config.get('sequence_length', 30)
        self.gesture_type = recorder_config.get('gesture_type', 'static')
        self.detector = HolisticDetector(config)
        
        # Statistics
        self.stats = {
            'videos_processed': 0,
            'images_processed': 0,
            'sequences_saved': 0,
            'errors': 0
        }

    def process_video(self, video_path):
        """Extract keypoints from all frames of a video."""
        cap = cv2.VideoCapture(video_path)
        sequence = []
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            image, results = self.detector.detect(frame)
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
            
        cap.release()
        return sequence if sequence else None

    def process_image(self, image_path):
        """Extract keypoints from a single image."""
        frame = cv2.imread(image_path)
        if frame is None:
            console.print(f"[red]Failed to read image: {image_path}[/red]")
            return None
            
        image, results = self.detector.detect(frame)
        keypoints = extract_keypoints(results)
        return keypoints

    def create_static_sequence(self, keypoints, repeat_count=None):
        """
        Create a sequence from a single image's keypoints.
        For static signs, we repeat the same keypoints to create a sequence.
        """
        if repeat_count is None:
            repeat_count = self.sequence_length
            
        # Repeat the keypoints to create a sequence
        sequence = np.array([keypoints for _ in range(repeat_count)])
        return sequence

    def save_sequence(self, sequence, output_dir, prefix="seq"):
        """Save a sequence to the output directory."""
        os.makedirs(output_dir, exist_ok=True)
        
        # Find next sequence number
        existing = len([f for f in os.listdir(output_dir) if f.endswith('.npy')])
        save_path = os.path.join(output_dir, f"{prefix}_{existing:03d}.npy")
        
        np.save(save_path, np.array(sequence))
        self.stats['sequences_saved'] += 1
        return save_path

    def run(self):
        """Process all media from the source directory."""
        console.print("\n[bold cyan]Media Recorder Mode[/bold cyan]")
        console.print("Supports: Videos (.mp4, .avi, .mov) AND Images (.jpg, .png, .bmp)\n")
        
        # Get source directory
        source_dir = self.rec_config.get('video_source_dir')
        
        if not source_dir:
            source_dir = input("Enter path to media directory (containing class subfolders): ").strip()
        
        if not os.path.exists(source_dir):
            console.print(f"[red]Error: Directory '{source_dir}' does not exist.[/red]")
            return

        # Get all class folders
        class_folders = [d for d in os.listdir(source_dir) 
                        if os.path.isdir(os.path.join(source_dir, d))]
        
        if not class_folders:
            console.print(f"[red]Error: No class folders found in '{source_dir}'[/red]")
            console.print("Expected structure: source_dir/class_name/images_or_videos")
            return
        
        console.print(f"Found {len(class_folders)} classes: {class_folders}\n")

        with Progress() as progress:
            overall_task = progress.add_task("[green]Processing Classes...", total=len(class_folders))
            
            for class_name in class_folders:
                class_path = os.path.join(source_dir, class_name)
                output_class_dir = os.path.join(self.output_dir, class_name)
                
                # Get all media files
                all_files = os.listdir(class_path)
                videos = [f for f in all_files if f.lower().endswith(VIDEO_EXTENSIONS)]
                images = [f for f in all_files if f.lower().endswith(IMAGE_EXTENSIONS)]
                
                total_files = len(videos) + len(images)
                
                if total_files == 0:
                    console.print(f"[yellow]Warning: No media files in '{class_name}'[/yellow]")
                    progress.advance(overall_task)
                    continue
                
                class_task = progress.add_task(
                    f"[cyan]{class_name}[/cyan] ({len(videos)} videos, {len(images)} images)", 
                    total=total_files
                )
                
                # Process videos
                for vid_file in videos:
                    vid_path = os.path.join(class_path, vid_file)
                    try:
                        sequence = self.process_video(vid_path)
                        if sequence:
                            self.save_sequence(sequence, output_class_dir, prefix="vid")
                            self.stats['videos_processed'] += 1
                    except Exception as e:
                        console.print(f"[red]Error processing video {vid_file}: {e}[/red]")
                        self.stats['errors'] += 1
                    progress.advance(class_task)
                
                # Process images (for static signs)
                for img_file in images:
                    img_path = os.path.join(class_path, img_file)
                    try:
                        keypoints = self.process_image(img_path)
                        if keypoints is not None:
                            # Create a sequence from the single image
                            sequence = self.create_static_sequence(keypoints)
                            self.save_sequence(sequence, output_class_dir, prefix="img")
                            self.stats['images_processed'] += 1
                    except Exception as e:
                        console.print(f"[red]Error processing image {img_file}: {e}[/red]")
                        self.stats['errors'] += 1
                    progress.advance(class_task)
                
                progress.advance(overall_task)
        
        self.detector.close()
        
        # Print summary
        console.print("\n" + "=" * 50)
        console.print("[bold green]Processing Complete![/bold green]")
        console.print(f"  Videos processed: {self.stats['videos_processed']}")
        console.print(f"  Images processed: {self.stats['images_processed']}")
        console.print(f"  Sequences saved:  {self.stats['sequences_saved']}")
        if self.stats['errors'] > 0:
            console.print(f"  [red]Errors: {self.stats['errors']}[/red]")
        console.print(f"\nOutput saved to: [cyan]{self.output_dir}[/cyan]")
        console.print("=" * 50)


# Keep backward compatibility
VideoRecorder = MediaRecorder


if __name__ == "__main__":
    # Test run
    from config.loader import ConfigLoader
    config = ConfigLoader.load_config()
    
    test_config = {
        'output_dir': 'dataset',
        'sequence_length': 30,
        'gesture_type': 'static'
    }
    
    recorder = MediaRecorder(config, test_config)
    recorder.run()
