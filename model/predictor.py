"""
Predictor for SignLens
Loads the trained model and performs real-time inference.
"""
import os
import json
import numpy as np
try:
    import tensorflow as tf
    from tensorflow import keras
    load_model = keras.models.load_model
except ImportError:
    print("TensorFlow not installed. Run: pip install tensorflow")
    raise


class SignPredictor:
    def __init__(self, model_path="model/signlens.h5", metadata_path="model/metadata.json"):
        """
        Initialize the predictor with a trained model.
        
        Args:
            model_path: Path to the saved Keras model
            metadata_path: Path to the metadata JSON file
        """
        self.model = None
        self.metadata = None
        self.classes = []
        self.sequence_length = 30
        self.sequence_buffer = []
        
        self._load_model(model_path, metadata_path)
    
    def _load_model(self, model_path, metadata_path):
        """Load the model and metadata."""
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found at '{model_path}'. "
                "Train the model first using: python -m model.train"
            )
        
        if not os.path.exists(metadata_path):
            raise FileNotFoundError(
                f"Metadata not found at '{metadata_path}'. "
                "Train the model first using: python -m model.train"
            )
        
        # Load model
        print(f"Loading model from {model_path}...")
        self.model = load_model(model_path)
        
        # Load metadata
        with open(metadata_path, 'r') as f:
            self.metadata = json.load(f)
        
        self.classes = self.metadata['classes']
        self.sequence_length = self.metadata['sequence_length']
        
        print(f"Model loaded. Classes: {self.classes}")
    
    def add_frame(self, keypoints):
        """
        Add a frame of keypoints to the buffer.
        
        Args:
            keypoints: numpy array of shape (1662,) containing keypoint values
        """
        self.sequence_buffer.append(keypoints)
        
        # Keep only the last sequence_length frames
        if len(self.sequence_buffer) > self.sequence_length:
            self.sequence_buffer.pop(0)
    
    def can_predict(self):
        """Check if we have enough frames to make a prediction."""
        return len(self.sequence_buffer) >= self.sequence_length
    
    def predict(self):
        """
        Make a prediction based on the current buffer.
        
        Returns:
            tuple: (predicted_class, confidence) or (None, 0) if not enough data
        """
        if not self.can_predict():
            return None, 0.0
        
        # Prepare input
        sequence = np.array(self.sequence_buffer[-self.sequence_length:])
        sequence = np.expand_dims(sequence, axis=0)  # Add batch dimension
        
        # Predict
        predictions = self.model.predict(sequence, verbose=0)[0]
        
        # Get best prediction
        class_idx = np.argmax(predictions)
        confidence = predictions[class_idx]
        predicted_class = self.classes[class_idx]
        
        return predicted_class, float(confidence)
    
    def predict_with_threshold(self, threshold=0.7):
        """
        Make a prediction only if confidence exceeds threshold.
        
        Args:
            threshold: Minimum confidence to return a prediction
            
        Returns:
            tuple: (predicted_class, confidence) or (None, confidence) if below threshold
        """
        predicted_class, confidence = self.predict()
        
        if confidence >= threshold:
            return predicted_class, confidence
        return None, confidence
    
    def clear_buffer(self):
        """Clear the sequence buffer."""
        self.sequence_buffer = []
    
    def get_all_predictions(self):
        """
        Get predictions for all classes.
        
        Returns:
            dict: {class_name: confidence} for all classes
        """
        if not self.can_predict():
            return {}
        
        sequence = np.array(self.sequence_buffer[-self.sequence_length:])
        sequence = np.expand_dims(sequence, axis=0)
        
        predictions = self.model.predict(sequence, verbose=0)[0]
        
        return {self.classes[i]: float(predictions[i]) for i in range(len(self.classes))}


if __name__ == "__main__":
    # Test the predictor
    try:
        predictor = SignPredictor()
        print("\n✅ Predictor initialized successfully!")
        print(f"Classes: {predictor.classes}")
        print(f"Sequence length: {predictor.sequence_length}")
    except FileNotFoundError as e:
        print(f"\n❌ {e}")
