"""
SignLens LSTM Model Architecture
Defines the neural network for sign language gesture classification.
"""

import tensorflow as tf
from tensorflow import keras

# Define shortcuts for readability
Sequential = keras.models.Sequential
LSTM = keras.layers.LSTM
Dense = keras.layers.Dense
Dropout = keras.layers.Dropout
BatchNormalization = keras.layers.BatchNormalization
EarlyStopping = keras.callbacks.EarlyStopping
ModelCheckpoint = keras.callbacks.ModelCheckpoint
ReduceLROnPlateau = keras.callbacks.ReduceLROnPlateau
Adam = keras.optimizers.Adam


def build_model(input_shape: tuple, num_classes: int, model_type: str = "standard") -> Sequential:
    """
    Build an LSTM Model for sign language recognition.
    
    Args:
        input_shape: Tuple of (sequence_length, num_features), e.g., (30, 1662)
        num_classes: Number of sign classes to predict
        model_type: "simple" for small datasets, "standard" for larger datasets
        
    Returns:
        Compiled Keras Sequential model
    """
    if model_type == "simple":
        return _build_simple_model(input_shape, num_classes)
    else:
        return _build_standard_model(input_shape, num_classes)


def _build_simple_model(input_shape: tuple, num_classes: int) -> Sequential:
    """
    Build a Simple LSTM Model for small datasets.
    Single LSTM layer - good for < 100 samples per class.
    """
    model = Sequential(name='SignLens_Simple')
    
    # Single LSTM Layer
    model.add(LSTM(64, return_sequences=False, activation='relu', input_shape=input_shape))
    model.add(BatchNormalization())
    model.add(Dropout(0.4))
    
    # Dense Classification Layers
    model.add(Dense(32, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dropout(0.4))
    
    model.add(Dense(num_classes, activation='softmax'))
    
    # Lower learning rate for stability
    optimizer = Adam(learning_rate=0.0005, clipnorm=1.0)
    
    model.compile(
        optimizer=optimizer,
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model


def _build_standard_model(input_shape: tuple, num_classes: int) -> Sequential:
    """
    Build a Standard LSTM Model for larger datasets.
    Three stacked LSTM layers - good for > 100 samples per class.
    """
    model = Sequential(name='SignLens_Standard')
    
    # LSTM Layer 1 - Initial temporal feature extraction
    model.add(LSTM(64, return_sequences=True, activation='relu', input_shape=input_shape))
    model.add(BatchNormalization())
    model.add(Dropout(0.2))
    
    # LSTM Layer 2 - Deeper temporal feature extraction  
    model.add(LSTM(128, return_sequences=True, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dropout(0.2))
    
    # LSTM Layer 3 - Final temporal encoding
    model.add(LSTM(64, return_sequences=False, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dropout(0.2))
    
    # Dense Layer 1 - Feature abstraction
    model.add(Dense(64, activation='relu'))
    model.add(BatchNormalization())
    
    # Dense Layer 2 - Further feature compression
    model.add(Dense(32, activation='relu'))
    model.add(BatchNormalization())
    
    # Output Layer
    model.add(Dense(num_classes, activation='softmax'))
    
    # Use label smoothing for better generalization
    loss = keras.losses.SparseCategoricalCrossentropy()
    optimizer = Adam(learning_rate=0.001)
    
    model.compile(
        optimizer=optimizer,
        loss=loss,
        metrics=['accuracy']
    )
    
    return model


def get_callbacks(model_path: str = "model/signlens.h5", patience: int = 15) -> list:
    """
    Get training callbacks for early stopping, checkpointing, and learning rate reduction.
    
    Args:
        model_path: Path to save the best model
        patience: Number of epochs to wait before early stopping
        
    Returns:
        List of Keras callbacks
    """
    callbacks = [
        # Stop training when validation loss stops improving
        EarlyStopping(
            monitor='val_loss',
            patience=patience,
            restore_best_weights=True,
            verbose=1
        ),
        
        # Save the best model
        ModelCheckpoint(
            filepath=model_path,
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1,
            save_weights_only=False
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


def get_model_summary(input_shape: tuple = (30, 1662), num_classes: int = 3, model_type: str = "standard") -> str:
    """
    Returns a string representation of the model architecture.
    
    Args:
        input_shape: Shape of input data
        num_classes: Number of output classes
        model_type: "simple" or "standard"
        
    Returns:
        String representation of model summary
    """
    model = build_model(input_shape, num_classes, model_type)
    
    # Capture summary to string
    string_list = []
    model.summary(print_fn=lambda x: string_list.append(x))
    
    return '\n'.join(string_list)


if __name__ == "__main__":
    # Test model creation
    print("=" * 50)
    print("SignLens Model Architecture Test")
    print("=" * 50)
    
    input_shape = (30, 1662)  # 30 frames, 1662 keypoint values
    num_classes = 5
    
    print("\n--- Simple Model (for small datasets) ---")
    simple_model = build_model(input_shape, num_classes, model_type="simple")
    simple_model.summary()
    
    print("\n--- Standard Model (for larger datasets) ---")
    standard_model = build_model(input_shape, num_classes, model_type="standard")
    standard_model.summary()
