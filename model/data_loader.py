"""
Data Loader for SignLens
Loads .npy keypoint sequences from dataset folder and prepares them for training.
"""
import os
import numpy as np
from sklearn.model_selection import train_test_split


class DataLoader:
    def __init__(self, dataset_path="dataset", sequence_length=30):
        self.dataset_path = dataset_path
        self.sequence_length = sequence_length
        self.classes = []
        self.label_map = {}
        
    def discover_classes(self):
        """Discover all class folders in the dataset."""
        if not os.path.exists(self.dataset_path):
            raise FileNotFoundError(f"Dataset path '{self.dataset_path}' not found")
        
        self.classes = sorted([
            d for d in os.listdir(self.dataset_path)
            if os.path.isdir(os.path.join(self.dataset_path, d))
        ])
        
        # Create label mapping: class_name -> integer
        self.label_map = {cls: idx for idx, cls in enumerate(self.classes)}
        
        print(f"Discovered {len(self.classes)} classes: {self.classes}")
        return self.classes
    
    def load_sequences(self):
        """Load all sequences from the dataset."""
        if not self.classes:
            self.discover_classes()
        
        sequences = []
        labels = []
        
        for class_name in self.classes:
            class_path = os.path.join(self.dataset_path, class_name)
            npy_files = [f for f in os.listdir(class_path) if f.endswith('.npy')]
            
            print(f"Loading {len(npy_files)} samples from '{class_name}'...")
            
            for npy_file in npy_files:
                file_path = os.path.join(class_path, npy_file)
                sequence = np.load(file_path)
                
                # Ensure consistent sequence length
                sequence = self._normalize_sequence_length(sequence)
                
                if sequence is not None:
                    sequences.append(sequence)
                    labels.append(self.label_map[class_name])
        
        X = np.array(sequences)
        y = np.array(labels)
        
        print(f"\nDataset loaded:")
        print(f"  Total samples: {len(X)}")
        print(f"  Sequence shape: {X.shape}")
        print(f"  Classes: {self.classes}")
        
        return X, y
    
    def _normalize_sequence_length(self, sequence):
        """Ensure all sequences have the same length."""
        current_len = len(sequence)
        
        if current_len == self.sequence_length:
            return sequence
        elif current_len > self.sequence_length:
            # Truncate - take the middle portion
            start = (current_len - self.sequence_length) // 2
            return sequence[start:start + self.sequence_length]
        else:
            # Pad with zeros at the end
            padding = np.zeros((self.sequence_length - current_len, sequence.shape[1]))
            return np.vstack([sequence, padding])
    
    def prepare_data(self, test_size=0.2, random_state=42):
        """Load data and split into train/test sets."""
        X, y = self.load_sequences()
        
        if len(self.classes) < 2:
            raise ValueError(f"Need at least 2 classes for training. Found: {self.classes}")
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        print(f"\nData split:")
        print(f"  Training samples: {len(X_train)}")
        print(f"  Test samples: {len(X_test)}")
        
        return X_train, X_test, y_train, y_test
    
    def get_num_classes(self):
        """Return number of classes."""
        return len(self.classes)
    
    def get_label_map(self):
        """Return the label mapping dictionary."""
        return self.label_map
    
    def get_reverse_label_map(self):
        """Return reverse mapping: integer -> class_name."""
        return {v: k for k, v in self.label_map.items()}


if __name__ == "__main__":
    # Test the data loader
    loader = DataLoader(dataset_path="dataset", sequence_length=30)
    loader.discover_classes()
    
    if len(loader.classes) >= 2:
        X_train, X_test, y_train, y_test = loader.prepare_data()
        print(f"\nReady for training!")
    else:
        print(f"\n⚠️  Need at least 2 classes. Currently have: {loader.classes}")
        print("Record more sign classes using: python record.py")
