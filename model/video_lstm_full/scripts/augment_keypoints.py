import os
import numpy as np

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'dataset', 'video_keypoints_full')
AUGMENTATION_FACTOR = 30  # Number of variations to create per original file

def add_noise(sequence, noise_level=0.01):
    # Adds slight jitter to the keypoints to simulate different body proportions/camera noise
    noise = np.random.normal(0, noise_level, sequence.shape)
    return sequence + noise

def scale_sequence(sequence, scale_range=(0.9, 1.1)):
    # Simulates the person being slightly closer or further from the camera
    scale_factor = np.random.uniform(scale_range[0], scale_range[1])
    return sequence * scale_factor

def augment_data():
    if not os.path.exists(DATA_PATH):
        print(f"Data path {DATA_PATH} not found!")
        return

    classes = [folder for folder in os.listdir(DATA_PATH) if os.path.isdir(os.path.join(DATA_PATH, folder))]
    
    total_augmented = 0
    for cls in classes:
        class_path = os.path.join(DATA_PATH, cls)
        
        # Only grab original files (avoid re-augmenting existing augmentations)
        files = [f for f in os.listdir(class_path) if f.endswith('.npy') and '_aug_' not in f]
        
        for file_name in files:
            file_path = os.path.join(class_path, file_name)
            original_sequence = np.load(file_path)
            
            for i in range(AUGMENTATION_FACTOR):
                # Apply random scaling and random noise to create a "new" unique variation
                aug_seq = scale_sequence(original_sequence, scale_range=(0.85, 1.15))
                aug_seq = add_noise(aug_seq, noise_level=0.005)
                
                # Save the new sequence
                new_file_name = file_name.replace('.npy', f'_aug_{i}.npy')
                np.save(os.path.join(class_path, new_file_name), aug_seq)
                total_augmented += 1
                
        print(f"Class '{cls}' augmented: {len(files) * AUGMENTATION_FACTOR} new sequences.")
        
    print(f"\nSuccessfully generated {total_augmented} new sequences!")

if __name__ == '__main__':
    augment_data()
