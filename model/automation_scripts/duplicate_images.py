import os
import shutil

# Path to the dataset_images directory (relative to this script)
dataset_dir = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'image')

# Number of times to duplicate each image (change as needed)
duplicates = 27  # This will make 27 copies of each image (original + 27 copies = 28 total)

for class_name in os.listdir(dataset_dir):
    class_dir = os.path.join(dataset_dir, class_name)
    if not os.path.isdir(class_dir):
        continue
    for img_name in os.listdir(class_dir):
        img_path = os.path.join(class_dir, img_name)
        if not os.path.isfile(img_path):
            continue
        name, ext = os.path.splitext(img_name)
        for i in range(1, duplicates + 1):
            new_img_name = f"{name}_copy{i}{ext}"
            new_img_path = os.path.join(class_dir, new_img_name)
            shutil.copy(img_path, new_img_path)
            print(f"Created: {new_img_path}")

print("Image duplication complete.")
