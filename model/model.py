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


def build_model(input_shape, num_classes):
    """
    Build a Simple LSTM Model for small datasets.
    """
    model = Sequential()
    
    # Single LSTM Layer is enough for simple static signs
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


def get_callbacks(model_path="model/signlens.h5"):
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


if __name__ == "__main__":
    # Test model creation
    input_shape = (30, 1662)  # 30 frames, 1662 keypoint values
    num_classes = 5
    
    model = build_model(input_shape, num_classes)
    model.summary()
