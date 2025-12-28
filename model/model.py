"""
LSTM Model for Sign Language Recognition
"""
import numpy as np

# TensorFlow/Keras imports
try:
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
    from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
    from tensorflow.keras.optimizers import Adam
except ImportError:
    print("TensorFlow not installed. Run: pip install tensorflow")
    raise


def build_model(input_shape, num_classes):
    """
    Build an LSTM model for sequence classification.
    
    Args:
        input_shape: Tuple of (sequence_length, num_features)
                     e.g., (30, 1662) for 30 frames of 1662 keypoint values
        num_classes: Number of sign classes to predict
    
    Returns:
        Compiled Keras model
    """
    model = Sequential([
        # First LSTM layer
        LSTM(64, return_sequences=True, activation='relu', input_shape=input_shape),
        BatchNormalization(),
        Dropout(0.3),
        
        # Second LSTM layer
        LSTM(128, return_sequences=True, activation='relu'),
        BatchNormalization(),
        Dropout(0.3),
        
        # Third LSTM layer
        LSTM(64, return_sequences=False, activation='relu'),
        BatchNormalization(),
        Dropout(0.3),
        
        # Dense layers
        Dense(64, activation='relu'),
        Dropout(0.3),
        
        Dense(32, activation='relu'),
        
        # Output layer
        Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model


def get_callbacks(model_path="model/signlens.keras"):
    """
    Get training callbacks for early stopping, checkpointing, and learning rate reduction.
    """
    callbacks = [
        # Stop training when validation loss stops improving
        EarlyStopping(
            monitor='val_loss',
            patience=15,
            restore_best_weights=True,
            verbose=1
        ),
        
        # Save the best model
        ModelCheckpoint(
            filepath=model_path,
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        ),
        
        # Reduce learning rate when stuck
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=0.00001,
            verbose=1
        )
    ]
    
    return callbacks


if __name__ == "__main__":
    # Test model creation
    input_shape = (30, 1662)  # 30 frames, 1662 keypoint values
    num_classes = 5
    
    model = build_model(input_shape, num_classes)
    model.summary()
