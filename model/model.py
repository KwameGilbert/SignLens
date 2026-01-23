"""
SignLens LSTM Model Architecture
Defines the neural network for sign language gesture classification.

All configurable values are read from config.yaml via the config parameter.
"""

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
from tensorflow.keras.losses import CategoricalCrossentropy
from tensorflow.keras.callbacks import TensorBoard, EarlyStopping, ModelCheckpoint, ReduceLROnPlateau


def build_model(input_shape: tuple, num_classes: int, config: dict) -> Sequential:
    """
    Builds and compiles the LSTM model for sign language recognition.
    
    All architecture parameters are read from config['model'].
    
    Args:
        input_shape: Tuple of (sequence_length, num_features), e.g., (30, 1662)
        num_classes: Number of sign classes to predict
        config: Configuration dictionary from config.yaml
        
    Returns:
        Compiled Keras Sequential model
    """
    # Get model settings from config
    model_config = config.get('model', {})
    label_smoothing = model_config.get('label_smoothing', 0.1)
    dropout_rate = model_config.get('dropout_rate', 0.2)
    
    # LSTM units from config
    lstm_units = model_config.get('lstm_units', {})
    lstm1_units = lstm_units.get('layer1', 64)
    lstm2_units = lstm_units.get('layer2', 128)
    lstm3_units = lstm_units.get('layer3', 64)
    
    # Dense units from config
    dense_units = model_config.get('dense_units', {})
    dense1_units = dense_units.get('layer1', 64)
    dense2_units = dense_units.get('layer2', 32)
    
    model = Sequential()
    
    # LSTM Layer 1
    model.add(LSTM(lstm1_units, return_sequences=True, activation='relu', input_shape=input_shape))
    model.add(BatchNormalization())
    model.add(Dropout(dropout_rate))
    
    # LSTM Layer 2
    model.add(LSTM(lstm2_units, return_sequences=True, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dropout(dropout_rate))
    
    # LSTM Layer 3
    model.add(LSTM(lstm3_units, return_sequences=False, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dropout(dropout_rate))
    
    # Dense Layer 1
    model.add(Dense(dense1_units, activation='relu'))
    model.add(BatchNormalization())
    
    # Dense Layer 2
    model.add(Dense(dense2_units, activation='relu'))
    model.add(BatchNormalization())
    
    # Output Layer
    model.add(Dense(num_classes, activation='softmax'))
    
    # Use CategoricalCrossentropy with Label Smoothing from config
    loss = CategoricalCrossentropy(label_smoothing=label_smoothing)
    
    model.compile(optimizer='Adam', loss=loss, metrics=['categorical_accuracy'])
    
    print(f"Model built with: LSTM({lstm1_units}→{lstm2_units}→{lstm3_units}), "
          f"Dense({dense1_units}→{dense2_units}), dropout={dropout_rate}, "
          f"label_smoothing={label_smoothing}")
    
    return model


def get_callbacks(config: dict) -> list:
    """
    Get training callbacks with settings from config.
    
    Args:
        config: Configuration dictionary from config.yaml
        
    Returns:
        List of Keras callbacks
    """
    # Get training settings from config
    training_config = config.get('training', {})
    model_path = training_config.get('model_path', 'model/signlens.h5')
    log_dir = training_config.get('log_dir', 'Logs')
    early_stopping_patience = training_config.get('early_stopping_patience', 10)
    reduce_lr_patience = training_config.get('reduce_lr_patience', 3)
    reduce_lr_factor = training_config.get('reduce_lr_factor', 0.5)
    min_lr = training_config.get('min_lr', 0.00001)
    
    callbacks = [
        # TensorBoard logging
        TensorBoard(log_dir=log_dir),
        
        # Early stopping
        EarlyStopping(
            monitor='val_loss',
            patience=early_stopping_patience,
            mode='min',
            restore_best_weights=True,
            verbose=1
        ),
        
        # Model checkpoint (save best model)
        ModelCheckpoint(
            filepath=model_path,
            monitor='val_categorical_accuracy',
            mode='max',
            save_best_only=True,
            verbose=1
        ),
        
        # Learning rate scheduler
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=reduce_lr_factor,
            patience=reduce_lr_patience,
            min_lr=min_lr,
            verbose=1
        )
    ]
    
    print(f"Callbacks: EarlyStopping(patience={early_stopping_patience}), "
          f"ReduceLR(factor={reduce_lr_factor}, patience={reduce_lr_patience})")
    
    return callbacks


if __name__ == "__main__":
    # Test model creation
    import os
    import sys
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from config.loader import ConfigLoader
    
    print("=" * 50)
    print("SignLens Model Architecture Test")
    print("=" * 50)
    
    config = ConfigLoader.load_config()
    
    input_shape = (30, 1662)  # 30 frames, 1662 keypoint values
    num_classes = 3
    
    model = build_model(input_shape, num_classes, config)
    model.summary()
    
    print("\n✅ Model created successfully!")
