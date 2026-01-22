"""
SignLens LSTM Model Architecture
Defines the neural network for sign language gesture classification.
"""

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
from tensorflow.keras.losses import CategoricalCrossentropy
from tensorflow.keras.optimizers import Adam


def get_model(input_shape: tuple, num_classes: int) -> Sequential:
    """
    Builds and compiles the LSTM model for sign language recognition.
    
    Architecture:
        - 3 stacked LSTM layers with BatchNormalization and Dropout
        - 2 Dense layers for feature extraction
        - Softmax output layer for classification
    
    Args:
        input_shape (tuple): Shape of the input (frames, keypoints).
                            Default is (30, 1662) for 30 frames and 1662 keypoints.
        num_classes (int): Number of sign classes to predict.
        
    Returns:
        model: Compiled Keras Sequential model.
        
    Example:
        >>> model = get_model(input_shape=(30, 1662), num_classes=3)
        >>> model.summary()
    """
    model = Sequential(name='SignLens_LSTM')
    
    # LSTM Layer 1 - Initial temporal feature extraction
    model.add(LSTM(
        64, 
        return_sequences=True, 
        activation='relu', 
        input_shape=input_shape,
        name='lstm_1'
    ))
    model.add(BatchNormalization(name='bn_1'))
    model.add(Dropout(0.2, name='dropout_1'))
    
    # LSTM Layer 2 - Deeper temporal feature extraction
    model.add(LSTM(
        128, 
        return_sequences=True, 
        activation='relu',
        name='lstm_2'
    ))
    model.add(BatchNormalization(name='bn_2'))
    model.add(Dropout(0.2, name='dropout_2'))
    
    # LSTM Layer 3 - Final temporal encoding
    model.add(LSTM(
        64, 
        return_sequences=False, 
        activation='relu',
        name='lstm_3'
    ))
    model.add(BatchNormalization(name='bn_3'))
    model.add(Dropout(0.2, name='dropout_3'))
    
    # Dense Layer 1 - Feature abstraction
    model.add(Dense(64, activation='relu', name='dense_1'))
    model.add(BatchNormalization(name='bn_4'))
    
    # Dense Layer 2 - Further feature compression
    model.add(Dense(32, activation='relu', name='dense_2'))
    model.add(BatchNormalization(name='bn_5'))
    
    # Output Layer - Classification
    model.add(Dense(num_classes, activation='softmax', name='output'))
    
    # Use Label Smoothing for better generalization
    loss = CategoricalCrossentropy(label_smoothing=0.1)
    
    # Compile with Adam optimizer
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss=loss,
        metrics=['categorical_accuracy']
    )
    
    return model


def get_model_summary(input_shape: tuple = (30, 1662), num_classes: int = 3) -> str:
    """
    Returns a string representation of the model architecture.
    
    Args:
        input_shape: Shape of input data
        num_classes: Number of output classes
        
    Returns:
        String representation of model summary
    """
    model = get_model(input_shape, num_classes)
    
    # Capture summary to string
    string_list = []
    model.summary(print_fn=lambda x: string_list.append(x))
    
    return '\n'.join(string_list)


if __name__ == '__main__':
    # Test model creation
    print("Creating SignLens LSTM Model...")
    model = get_model(input_shape=(30, 1662), num_classes=3)
    model.summary()
    print("\nModel created successfully!")
