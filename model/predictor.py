"""
Predictor for SignLens
Loads the trained model and performs real-time inference.

All settings are read from config.yaml.
"""
import os
import numpy as np

from tensorflow.keras.models import load_model


class SignPredictor:
    """
    Sign Language Predictor class for real-time inference.
    
    Manages a frame buffer and provides predictions based on
    a trained LSTM model.
    """
    
    def __init__(self, config: dict):
        """
        Initialize the predictor with configuration.
        
        Args:
            config: Configuration dictionary from config.yaml
        """
        self.model = None
        self.classes = []
        
        # Get settings from config
        data_config = config.get('data_collection', {})
        self.sequence_length = data_config.get('sequence_length', 30)
        self.dataset_path = data_config.get('data_path', 'dataset')
        
        training_config = config.get('training', {})
        self.model_path = training_config.get('model_path', 'model/signlens.h5')
        
        self.sequence_buffer = []
        
        self._load_model()
    
    def _load_model(self):
        """Load the model and discover classes from dataset folders."""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"Model not found at '{self.model_path}'. "
                "Train the model first using: python -m model.train"
            )
        
        # Load model
        print(f"Loading model from {self.model_path}...")
        self.model = load_model(self.model_path)
        
        # Load classes from dataset folders
        if os.path.exists(self.dataset_path):
            self.classes = np.array(sorted([
                folder for folder in os.listdir(self.dataset_path) 
                if os.path.isdir(os.path.join(self.dataset_path, folder))
            ]))
        else:
            raise FileNotFoundError(f"Dataset not found at '{self.dataset_path}'")
        
        print(f"Model loaded. Classes: {list(self.classes)}")
    
    def add_frame(self, keypoints: np.ndarray):
        """
        Add a frame of keypoints to the buffer.
        
        Args:
            keypoints: numpy array of shape (1662,) containing keypoint values
        """
        self.sequence_buffer.append(keypoints)
        
        # Keep only the last sequence_length frames
        self.sequence_buffer = self.sequence_buffer[-self.sequence_length:]
    
    def can_predict(self) -> bool:
        """Check if we have enough frames to make a prediction."""
        return len(self.sequence_buffer) >= self.sequence_length
    
    def predict(self) -> tuple:
        """
        Make a prediction based on the current buffer.
        
        Returns:
            tuple: (predictions_array, predicted_class_name)
        """
        if not self.can_predict():
            return None, None
        
        # Prepare input
        sequence = np.expand_dims(self.sequence_buffer[-self.sequence_length:], axis=0)
        
        # Predict
        res = self.model.predict(sequence, verbose=0)[0]
        predicted_class = self.classes[np.argmax(res)]
        
        return res, predicted_class
    
    def get_prediction_with_confidence(self, threshold: float = 0.5) -> tuple:
        """
        Make a prediction with confidence threshold.
        
        Args:
            threshold: Minimum confidence to return a prediction
            
        Returns:
            tuple: (predicted_class, confidence) or (None, confidence)
        """
        res, predicted_class = self.predict()
        
        if res is None:
            return None, 0.0
        
        confidence = float(res[np.argmax(res)])
        
        if confidence > threshold:
            return predicted_class, confidence
        return None, confidence
    
    def clear_buffer(self):
        """Clear the sequence buffer."""
        self.sequence_buffer = []
    
    def get_buffer_status(self) -> dict:
        """Get the current buffer status."""
        return {
            'buffer_size': len(self.sequence_buffer),
            'sequence_length': self.sequence_length,
            'ready': self.can_predict()
        }


if __name__ == "__main__":
    # Test the predictor
    import sys
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from config.loader import ConfigLoader
    
    config = ConfigLoader.load_config()
    
    try:
        predictor = SignPredictor(config)
        print("\n✅ Predictor initialized successfully!")
        print(f"Classes: {list(predictor.classes)}")
        print(f"Sequence length: {predictor.sequence_length}")
        print(f"Buffer status: {predictor.get_buffer_status()}")
    except FileNotFoundError as e:
        print(f"\n❌ {e}")
