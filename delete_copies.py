import os

# Path to the dataset_images directory (relative to this script)
dataset_dir = os.path.join(os.getcwd(), 'dataset_images')

deleted_count = 0
for class_name in os.listdir(dataset_dir):
    class_dir = os.path.join(dataset_dir, class_name)
    if not os.path.isdir(class_dir):
        continue
    for img_name in os.listdir(class_dir):
        if 'copy' in img_name:
            img_path = os.path.join(class_dir, img_name)
            try:
                os.remove(img_path)
                print(f"Deleted: {img_path}")
                deleted_count += 1
            except Exception as e:
                print(f"Failed to delete {img_path}: {e}")
print(f"Total images deleted: {deleted_count}")
