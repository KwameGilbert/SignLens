"""
Data Loader for SignLens
Loads .npy keypoint sequences from dataset folder and prepares them for training.

All configurable values are read from config.yaml via the config parameter.
"""
import os
import numpy as np
from tensorflow.keras.utils import to_categorical


class DataLoader:
    """
    Dataset loader for sign language keypoint sequences.
    
    Handles loading, augmentation, and splitting of .npy sequence files
    organized in class folders.
    """
    
    def __init__(self, config: dict):
        """
        Initialize the data loader with configuration.
        
        Args:
            config: Configuration dictionary from config.yaml
        """
        # Get data collection settings from config
        data_config = config.get('data_collection', {})
        self.dataset_path = data_config.get('data_path', 'dataset')
        self.sequence_length = data_config.get('sequence_length', 30)
        
        # Get augmentation settings from config
        aug_config = config.get('augmentation', {})
        self.augment_enabled = aug_config.get('enabled', True)
        self.jitter_std = aug_config.get('jitter_std', 0.05)
        self.scale_min = aug_config.get('scale_min', 0.9)
        self.scale_max = aug_config.get('scale_max', 1.1)
        
        # Get training settings
        training_config = config.get('training', {})
        self.test_size = training_config.get('test_size', 0.05)
        
        self.classes = []
        self.label_map = {}
        
    def discover_classes(self) -> list:
        """
        Discover all class folders in the dataset.
        
        Returns:
            List of class names (sorted alphabetically)
        """
        if not os.path.exists(self.dataset_path):
            raise FileNotFoundError(f"Dataset path '{self.dataset_path}' not found")
        
        # Get all directories, sorted
        self.classes = np.array(sorted([
            d for d in os.listdir(self.dataset_path)
            if os.path.isdir(os.path.join(self.dataset_path, d))
        ]))
        
        # Create label mapping: class_name -> integer
        self.label_map = {label: num for num, label in enumerate(self.classes)}
        
        print(f"Found classes: {self.classes}")
        return self.classes
    
    def load_sequences(self) -> tuple:
        """
        Load all sequences from the dataset.
        
        Returns:
            Tuple of (X, y) where X is array of sequences and y is one-hot encoded labels
        """
        if len(self.classes) == 0:
            self.discover_classes()
        
        sequences = []
        labels = []
        
        for action in self.classes:
            action_path = os.path.join(self.dataset_path, action)
            file_list = os.listdir(action_path)
            print(f"Loading {len(file_list)} sequences for class '{action}'...")
            
            for file_name in file_list:
                if file_name.endswith('.npy'):
                    file_path = os.path.join(action_path, file_name)
                    try:
                        window = np.load(file_path)
                        
                        # Fix: Ensure all sequences have exactly SEQUENCE_LENGTH frames
                        if len(window) != self.sequence_length:
                            if len(window) > self.sequence_length:
                                # Truncate to middle
                                start = (len(window) - self.sequence_length) // 2
                                window = window[start : start + self.sequence_length]
                            else:
                                # Pad with zeros
                                padding = np.zeros((self.sequence_length - len(window), window.shape[1]))
                                window = np.vstack([window, padding])
                        
                        # Fix: Ensure all frames have exactly 1662 keypoints
                        if window.shape[1] != 1662:
                            print(f"  ⚠️ Skipping {file_name}: Incorrect feature count ({window.shape[1]} instead of 1662)")
                            continue

                        sequences.append(window)
                        labels.append(self.label_map[action])
                    except Exception as e:
                        print(f"  ⚠️ Error loading {file_name}: {e}")
        
        X = np.array(sequences)
        # Use to_categorical for one-hot encoding
        y = to_categorical(labels).astype(int)
        
        print(f"\nDataset loaded:")
        print(f"  Total samples: {len(X)}")
        print(f"  Data shape: {X.shape}")
        print(f"  Labels shape: {y.shape}")
        
        return X, y
    
    def augment_data(self, X: np.ndarray, y: np.ndarray) -> tuple:
        """
        Augment data with jitter and scaling.
        
        Uses jitter_std, scale_min, scale_max from config.
        
        Args:
            X: Input sequences
            y: One-hot encoded labels
            
        Returns:
            Tuple of (augmented_X, augmented_y)
        """
        print(f"Augmenting data (jitter_std={self.jitter_std}, scale={self.scale_min}-{self.scale_max})...")
        augmented_X = []
        augmented_y = []
        
        for x_seq, y_label in zip(X, y):
            # 1. Original (Keep it)
            augmented_X.append(x_seq)
            augmented_y.append(y_label)
            
            # 2. Jitter (Add random noise)
            noise = np.random.normal(0, self.jitter_std, x_seq.shape)
            jittered_x = x_seq + noise
            augmented_X.append(jittered_x)
            augmented_y.append(y_label)
            
            # 3. Scaling (Zoom in/out)
            scale = np.random.uniform(self.scale_min, self.scale_max)
            scaled_x = x_seq * scale
            augmented_X.append(scaled_x)
            augmented_y.append(y_label)

        print(f"  Original: {len(X)} → Augmented: {len(augmented_X)}")
        return np.array(augmented_X), np.array(augmented_y)
    
    def prepare_data(self) -> tuple:
        """
        Load data and split into train/test sets.
        
        Uses test_size and augment_enabled from config.
        
        Returns:
            Tuple of (X_train, X_test, y_train, y_test)
        """
        X, y = self.load_sequences()
        
        if len(self.classes) < 2:
            raise ValueError(f"Need at least 2 classes for training. Found: {list(self.classes)}")
        
        # Apply augmentation if enabled in config
        if self.augment_enabled:
            X, y = self.augment_data(X, y)
        
        # Manual split (no scikit-learn dependency)
        # Shuffle indices
        indices = np.arange(len(X))
        np.random.shuffle(indices)
        
        X = X[indices]
        y = y[indices]
        
        # Calculate split index using test_size from config
        split_index = int(len(X) * (1 - self.test_size))
        
        X_train, X_test = X[:split_index], X[split_index:]
        y_train, y_test = y[:split_index], y[split_index:]
        
        print(f"\nData split (test_size={self.test_size}):")
        print(f"  Training Data: {X_train.shape}")
        print(f"  Testing Data: {X_test.shape}")
        
        return X_train, X_test, y_train, y_test
    
    def get_num_classes(self) -> int:
        """Return number of classes."""
        return len(self.classes)
    
    def get_classes(self) -> np.ndarray:
        """Return the classes array."""
        return self.classes
    
    def get_label_map(self) -> dict:
        """Return the label mapping dictionary."""
        return self.label_map


if __name__ == "__main__":
    # Test the data loader
    import sys
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from config.loader import ConfigLoader
    
    config = ConfigLoader.load_config()
    loader = DataLoader(config)
    
    try:
        loader.discover_classes()
        
        if len(loader.classes) >= 2:
            X_train, X_test, y_train, y_test = loader.prepare_data()
            print(f"\n✅ Ready for training!")
            print(f"   X_train shape: {X_train.shape}")
            print(f"   y_train shape: {y_train.shape}")
        else:
            print(f"\n⚠️ Need at least 2 classes. Currently have: {list(loader.classes)}")
    except FileNotFoundError as e:
        print(f"\n❌ {e}")
