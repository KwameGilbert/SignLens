from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def get_model(input_shape, num_classes):
    """
    Builds and compiles the LSTM model.
    
    Args:
        input_shape (tuple): Shape of the input (frames, keypoints), e.g., (30, 1662).
        num_classes (int): Number of sign classes to predict.
        
    Returns:
        model: Compiled Keras model.
    """
    model = Sequential()
    
    # LSTM Layer 1: Returns sequences to next LSTM layer
    model.add(LSTM(64, return_sequences=True, activation='relu', input_shape=input_shape))
    
    # LSTM Layer 2: Returns sequences to next LSTM layer
    model.add(LSTM(128, return_sequences=True, activation='relu'))
    
    # LSTM Layer 3: Last LSTM layer, does not return sequences
    model.add(LSTM(64, return_sequences=False, activation='relu'))
    
    # Dense Layers for classification
    model.add(Dense(64, activation='relu'))
    model.add(Dense(32, activation='relu'))
    
    # Output Layer
    model.add(Dense(num_classes, activation='softmax'))
    
    model.compile(optimizer='Adam', loss='categorical_crossentropy', metrics=['categorical_accuracy'])
    
    return model
