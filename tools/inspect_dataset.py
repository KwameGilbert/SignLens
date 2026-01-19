import numpy as np
import os
import glob

def inspect_dataset(dataset_dir="dataset"):
    print(f"Inspecting dataset in: {dataset_dir}\n")
    
    if not os.path.exists(dataset_dir):
        print("Dataset directory not found!")
        return

    classes = [d for d in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, d))]
    
    for class_name in classes:
        class_dir = os.path.join(dataset_dir, class_name)
        files = glob.glob(os.path.join(class_dir, "*.npy"))
        
        print(f"--- Class: {class_name} ({len(files)} files) ---")
        
        if not files:
            print("  No .npy files found.")
            continue
            
        # Check first 5 files
        zero_sequences = 0
        valid_sequences = 0
        
        for f in files:
            try:
                data = np.load(f)
                # content shape is (frames, keypoints)
                # Check for all zeros
                if np.all(data == 0):
                    zero_sequences += 1
                else:
                    valid_sequences += 1
                    
                    # Print stats for the first valid one
                    if valid_sequences == 1:
                        print(f"  Sample shape: {data.shape}")
                        print(f"  Max value: {np.max(data):.4f}")
                        print(f"  Min value: {np.min(data):.4f}")
                        print(f"  Mean value: {np.mean(data):.4f}")
                        
            except Exception as e:
                print(f"  Error reading {f}: {e}")

        if zero_sequences > 0:
            print(f"  ⚠️  WARNING: Found {zero_sequences} EMPTY (all-zero) sequences!")
        
        if valid_sequences == 0 and zero_sequences > 0:
            print(f"  ❌ CRITICAL: ALL sequences for class '{class_name}' are empty (zeros). Model cannot learn.")
        elif valid_sequences > 0:
            print(f"  ✅ Valid sequences: {valid_sequences}")
        
        print("")

if __name__ == "__main__":
    inspect_dataset()
