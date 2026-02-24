from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
from tensorflow.keras.losses import CategoricalCrossentropy

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
    
    # LSTM Layer 1
    model.add(LSTM(64, return_sequences=True, activation='tanh', input_shape=input_shape))
    model.add(BatchNormalization())
    model.add(Dropout(0.2))
    
    # LSTM Layer 2
    model.add(LSTM(128, return_sequences=True, activation='tanh'))
    model.add(BatchNormalization())
    model.add(Dropout(0.2))
    
    # LSTM Layer 3
    model.add(LSTM(64, return_sequences=False, activation='tanh'))
    model.add(BatchNormalization())
    model.add(Dropout(0.2))
    
    # Dense Layers for classification
    model.add(Dense(64, activation='tanh'))
    model.add(BatchNormalization())
    model.add(Dense(32, activation='tanh'))
    model.add(BatchNormalization())
    
    # Output Layer
    model.add(Dense(num_classes, activation='softmax'))
    
    # Use Label Smoothing
    loss = CategoricalCrossentropy(label_smoothing=0.1)
    
    model.compile(optimizer='Adam', loss=loss, metrics=['categorical_accuracy'])
    
    return model
