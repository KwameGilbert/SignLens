"""
SignLens Model Training Script
Trains an LSTM model on collected sign language gesture data.
"""

import numpy as np
import os

from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import TensorBoard, EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
import matplotlib.pyplot as plt

from config import ConfigLoader
from model import get_model
from utils import setup_logger


def load_data(data_path: str, logger):
    """
    Loads sequences and labels from the dataset directory.
    
    Args:
        data_path: Path to the dataset directory
        logger: Logger instance
        
    Returns:
        Tuple of (sequences, labels, actions)
    """
    actions = np.array([
        folder for folder in os.listdir(data_path) 
        if os.path.isdir(os.path.join(data_path, folder))
    ])
    
    sequences, labels = [], []
    label_map = {label: num for num, label in enumerate(actions)}
    
    logger.info(f"Found classes: {list(actions)}")
    print(f"Found classes: {actions}")
    
    for action in actions:
        action_path = os.path.join(data_path, action)
        file_list = os.listdir(action_path)
        logger.info(f"Loading {len(file_list)} sequences for class '{action}'...")
        print(f"Loading {len(file_list)} sequences for class '{action}'...")
        
        for file_name in file_list:
            if file_name.endswith('.npy'):
                window = np.load(os.path.join(action_path, file_name))
                sequences.append(window)
                labels.append(label_map[action])
                
    return np.array(sequences), to_categorical(labels).astype(int), actions


def augment_data(X: np.ndarray, y: np.ndarray, logger) -> tuple:
    """
    Augments data by adding random noise (jitter) and scaling.
    Triples the dataset size.
    
    Args:
        X: Input sequences
        y: Labels
        logger: Logger instance
        
    Returns:
        Tuple of (augmented_X, augmented_y)
    """
    logger.info("Augmenting data...")
    print("Augmenting data...")
    
    augmented_X = []
    augmented_y = []
    
    for x_seq, y_label in zip(X, y):
        # 1. Original (Keep it)
        augmented_X.append(x_seq)
        augmented_y.append(y_label)
        
        # 2. Jitter (Add random noise)
        noise = np.random.normal(0, 0.05, x_seq.shape)
        jittered_x = x_seq + noise
        augmented_X.append(jittered_x)
        augmented_y.append(y_label)
        
        # 3. Scaling (Zoom in/out slightly)
        scale = np.random.uniform(0.9, 1.1)
        scaled_x = x_seq * scale
        augmented_X.append(scaled_x)
        augmented_y.append(y_label)

    return np.array(augmented_X), np.array(augmented_y)


def plot_history(history):
    """
    Plots training accuracy and loss.
    """
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    
    # Accuracy
    ax1.plot(history.history['categorical_accuracy'], label='Train Accuracy')
    ax1.plot(history.history['val_categorical_accuracy'], label='Validation Accuracy')
    ax1.set_title('Model Accuracy')
    ax1.set_ylabel('Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.legend()
    
    # Loss
    ax2.plot(history.history['loss'], label='Train Loss')
    ax2.plot(history.history['val_loss'], label='Validation Loss')
    ax2.set_title('Model Loss')
    ax2.set_ylabel('Loss')
    ax2.set_xlabel('Epoch')
    ax2.legend()
    
    plt.tight_layout()
    plt.savefig('training_history.png', dpi=150)
    plt.show()


def plot_confusion_matrix(y_true: np.ndarray, y_pred: np.ndarray, classes: np.ndarray):
    """
    Computes and plots confusion matrix using pure NumPy/Matplotlib.
    """
    # 1. Compute Confusion Matrix
    num_classes = len(classes)
    cm = np.zeros((num_classes, num_classes), dtype=int)
    
    y_true_indices = np.argmax(y_true, axis=1)
    y_pred_indices = np.argmax(y_pred, axis=1)
    
    for t, p in zip(y_true_indices, y_pred_indices):
        cm[t][p] += 1

    # 2. Plot
    fig, ax = plt.subplots(figsize=(8, 8))
    cax = ax.matshow(cm, cmap=plt.cm.Blues)
    fig.colorbar(cax)
    
    # Labels
    ax.set_xticks(np.arange(num_classes))
    ax.set_yticks(np.arange(num_classes))
    ax.set_xticklabels(classes, rotation=45)
    ax.set_yticklabels(classes)
    
    # Text Annotations
    for i in range(num_classes):
        for j in range(num_classes):
            ax.text(j, i, str(cm[i, j]), ha='center', va='center', color='black')
            
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.savefig('confusion_matrix.png', dpi=150)
    plt.show()


def main():
    # 1. Load Configuration
    config = ConfigLoader.get_config()
    logger = setup_logger(config)
    
    # Get settings from config
    data_path = config['data_collection']['data_path']
    sequence_length = config['data_collection']['sequence_length']
    model_path = config['training']['model_path']
    log_dir = config['training']['log_dir']
    epochs = config['training']['epochs']
    test_size = config['training']['test_size']
    
    logger.info("=" * 50)
    logger.info("SignLens Model Training")
    logger.info("=" * 50)
    
    # Ensure model directory exists
    model_dir = os.path.dirname(model_path)
    if model_dir:
        os.makedirs(model_dir, exist_ok=True)
    
    # 2. Load Data
    X, y, actions = load_data(data_path, logger)
    
    if len(X) == 0:
        logger.error("No data found! Please run collect_data.py first.")
        print("No data found! Please run collect_data.py first.")
        return

    # 3. Augment Data
    X, y = augment_data(X, y, logger)

    logger.info(f"Data shape: {X.shape}")
    logger.info(f"Labels shape: {y.shape}")
    print(f"Data shape: {X.shape}")
    print(f"Labels shape: {y.shape}")

    # 4. Split Data (Manual Split without scikit-learn)
    indices = np.arange(len(X))
    np.random.shuffle(indices)
    
    X = X[indices]
    y = y[indices]
    
    # Calculate split index
    split_index = int(len(X) * (1 - test_size))
    
    X_train, X_test = X[:split_index], X[split_index:]
    y_train, y_test = y[:split_index], y[split_index:]
    
    logger.info(f"Training Data: {X_train.shape}")
    logger.info(f"Testing Data: {X_test.shape}")
    print(f"Training Data: {X_train.shape}")
    print(f"Testing Data: {X_test.shape}")
    
    # 5. Build Model
    # Keypoints: pose(33*4) + face(468*3) + left_hand(21*3) + right_hand(21*3) = 1662
    num_keypoints = 1662
    model = get_model(input_shape=(sequence_length, num_keypoints), num_classes=len(actions))
    
    # 6. Setup Callbacks
    logger.info("Setting up training callbacks...")
    os.makedirs(log_dir, exist_ok=True)
    
    callbacks = [
        TensorBoard(log_dir=log_dir),
        EarlyStopping(
            monitor='val_loss', 
            patience=10, 
            mode='min', 
            restore_best_weights=True
        ),
        ModelCheckpoint(
            model_path, 
            monitor='val_categorical_accuracy', 
            mode='max', 
            save_best_only=True, 
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss', 
            factor=0.5, 
            patience=3, 
            verbose=1
        )
    ]
    
    # 7. Train Model
    logger.info(f"Starting training for {epochs} epochs...")
    print("Starting training...")
    
    history = model.fit(
        X_train, y_train, 
        epochs=epochs, 
        callbacks=callbacks, 
        validation_data=(X_test, y_test),
        verbose=1
    )
    
    logger.info("Training complete!")
    
    # 8. Plot Results
    logger.info("Generating training plots...")
    plot_history(history)
    
    # 9. Generate Confusion Matrix
    logger.info("Generating Confusion Matrix...")
    print("Generating Confusion Matrix...")
    y_pred = model.predict(X_test)
    plot_confusion_matrix(y_test, y_pred, actions)
    
    logger.info(f"Model saved to: {model_path}")
    print(f"Model saved to: {model_path}")


if __name__ == '__main__':
    main()
