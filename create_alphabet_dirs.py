import os

# List of all alphabet letters (A-Z)
alphabet = [chr(i) for i in range(ord('A'), ord('Z')+1)]

# Path to the dataset_video directory (relative to project root)
dataset_dir = os.path.join(os.getcwd(), 'dataset_video')

# Create the main dataset_images directory if it doesn't exist
os.makedirs(dataset_dir, exist_ok=True)

# Create a subdirectory for each letter
for letter in alphabet:
    class_dir = os.path.join(dataset_dir, letter)
    os.makedirs(class_dir, exist_ok=True)
    print(f"Created directory: {class_dir}")

print("All alphabet directories created in dataset_images/.")
