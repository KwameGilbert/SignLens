"""
Data Loader for SignLens
Loads .npy keypoint sequences from dataset folder and prepares them for training.
"""
import os
import numpy as np
from sklearn.model_selection import train_test_split


class DataLoader:
    """
    Dataset loader for sign language keypoint sequences.
    
    Handles loading, normalization, and splitting of .npy sequence files
    organized in class folders.
    """
    
    def __init__(self, dataset_path: str = "dataset", sequence_length: int = 30, config: dict = None):
        """
        Initialize the data loader.
        
        Args:
            dataset_path: Path to the dataset directory
            sequence_length: Expected number of frames per sequence
            config: Optional configuration dictionary
        """
        # Use config values if provided
        if config is not None:
            data_config = config.get('data_collection', {})
            dataset_path = data_config.get('data_path', dataset_path)
            sequence_length = data_config.get('sequence_length', sequence_length)
        
        self.dataset_path = dataset_path
        self.sequence_length = sequence_length
        self.classes = []
        self.label_map = {}
        
    def discover_classes(self) -> list:
        """
        Discover all class folders in the dataset.
        
        Returns:
            List of class names
        """
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
    
    def load_sequences(self) -> tuple:
        """
        Load all sequences from the dataset.
        
        Returns:
            Tuple of (X, y) where X is array of sequences and y is array of labels
        """
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
                try:
                    sequence = np.load(file_path)
                    
                    # Ensure consistent sequence length
                    sequence = self._normalize_sequence_length(sequence)
                    
                    if sequence is not None:
                        sequences.append(sequence)
                        labels.append(self.label_map[class_name])
                except Exception as e:
                    print(f"  ⚠️ Error loading {npy_file}: {e}")
        
        X = np.array(sequences)
        y = np.array(labels)
        
        print(f"\nDataset loaded:")
        print(f"  Total samples: {len(X)}")
        print(f"  Sequence shape: {X.shape}")
        print(f"  Classes: {self.classes}")
        
        return X, y
    
    def _normalize_sequence_length(self, sequence: np.ndarray) -> np.ndarray:
        """
        Ensure all sequences have the same length.
        
        Args:
            sequence: Input sequence array
            
        Returns:
            Normalized sequence with consistent length
        """
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
    
    def augment_data(self, X: np.ndarray, y: np.ndarray) -> tuple:
        """
        Augment data with jitter and scaling.
        
        Args:
            X: Input sequences
            y: Labels
            
        Returns:
            Tuple of (augmented_X, augmented_y)
        """
        print("Augmenting data...")
        augmented_X = []
        augmented_y = []
        
        for x_seq, y_label in zip(X, y):
            # 1. Keep original
            augmented_X.append(x_seq)
            augmented_y.append(y_label)
            
            # 2. Add jitter (random noise)
            noise = np.random.normal(0, 0.02, x_seq.shape)
            jittered = x_seq + noise
            augmented_X.append(jittered)
            augmented_y.append(y_label)
            
            # 3. Scaling (slight zoom)
            scale = np.random.uniform(0.95, 1.05)
            scaled = x_seq * scale
            augmented_X.append(scaled)
            augmented_y.append(y_label)
        
        print(f"  Original: {len(X)} → Augmented: {len(augmented_X)}")
        return np.array(augmented_X), np.array(augmented_y)
    
    def prepare_data(self, test_size: float = 0.2, random_state: int = 42, augment: bool = True) -> tuple:
        """
        Load data and split into train/test sets.
        
        Args:
            test_size: Fraction of data for testing
            random_state: Random seed for reproducibility
            augment: Whether to apply data augmentation
            
        Returns:
            Tuple of (X_train, X_test, y_train, y_test)
        """
        X, y = self.load_sequences()
        
        if len(self.classes) < 2:
            raise ValueError(f"Need at least 2 classes for training. Found: {self.classes}")
        
        # Apply augmentation if requested
        if augment:
            X, y = self.augment_data(X, y)
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        print(f"\nData split:")
        print(f"  Training samples: {len(X_train)}")
        print(f"  Test samples: {len(X_test)}")
        
        return X_train, X_test, y_train, y_test
    
    def get_num_classes(self) -> int:
        """Return number of classes."""
        return len(self.classes)
    
    def get_label_map(self) -> dict:
        """Return the label mapping dictionary."""
        return self.label_map
    
    def get_reverse_label_map(self) -> dict:
        """Return reverse mapping: integer -> class_name."""
        return {v: k for k, v in self.label_map.items()}
    
    def get_class_distribution(self) -> dict:
        """
        Get the distribution of samples per class.
        
        Returns:
            dict: {class_name: sample_count}
        """
        if not self.classes:
            self.discover_classes()
        
        distribution = {}
        for class_name in self.classes:
            class_path = os.path.join(self.dataset_path, class_name)
            npy_files = [f for f in os.listdir(class_path) if f.endswith('.npy')]
            distribution[class_name] = len(npy_files)
        
        return distribution


if __name__ == "__main__":
    # Test the data loader
    loader = DataLoader(dataset_path="dataset", sequence_length=30)
    
    try:
        loader.discover_classes()
        
        print("\nClass distribution:")
        for cls, count in loader.get_class_distribution().items():
            print(f"  {cls}: {count} samples")
        
        if len(loader.classes) >= 2:
            X_train, X_test, y_train, y_test = loader.prepare_data()
            print(f"\n✅ Ready for training!")
            print(f"   X_train shape: {X_train.shape}")
            print(f"   X_test shape: {X_test.shape}")
        else:
            print(f"\n⚠️ Need at least 2 classes. Currently have: {loader.classes}")
            print("   Record more sign classes using: python record.py")
    except FileNotFoundError as e:
        print(f"\n❌ {e}")
