import numpy as np
import os

from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import TensorBoard
import matplotlib.pyplot as plt
from model import get_model

# --- Configuration ---
DATA_PATH = os.path.join('dataset')
SEQUENCE_LENGTH = 30

def load_data():
    """
    Loads sequences and labels from the dataset directory.
    """
    actions = np.array([folder for folder in os.listdir(DATA_PATH) if os.path.isdir(os.path.join(DATA_PATH, folder))])
    
    sequences, labels = [], []
    
    label_map = {label:num for num, label in enumerate(actions)}
    
    print(f"Found classes: {actions}")
    
    for action in actions:
        action_path = os.path.join(DATA_PATH, action)
        file_list = os.listdir(action_path)
        print(f"Loading {len(file_list)} sequences for class '{action}'...")
        
        for file_name in file_list:
            if file_name.endswith('.npy'):
                window = np.load(os.path.join(action_path, file_name))
                sequences.append(window)
                labels.append(label_map[action])
                
    return np.array(sequences), to_categorical(labels).astype(int), actions

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
    plt.show()

def main():
    # 1. Load Data
    X, y, actions = load_data()
    
    if len(X) == 0:
        print("No data found! Please run collect_data.py first.")
        return

    print(f"Data shape: {X.shape}")
    print(f"Labels shape: {y.shape}")

    # 2. Split Data (Manual Split without scikit-learn)
    # create a list of indices and shuffle them
    indices = np.arange(len(X))
    np.random.shuffle(indices)
    
    X = X[indices]
    y = y[indices]
    
    # Calculate split index for 5% testing
    test_size = 0.05
    split_index = int(len(X) * (1 - test_size))
    
    X_train, X_test = X[:split_index], X[split_index:]
    y_train, y_test = y[:split_index], y[split_index:]
    
    print(f"Training Data: {X_train.shape}")
    print(f"Testing Data: {X_test.shape}")
    
    # 3. Build Model
    model = get_model(input_shape=(SEQUENCE_LENGTH, 1662), num_classes=actions.shape[0])
    
    # 4. Train
    print("Starting training...")
    log_dir = os.path.join('Logs')
    tb_callback = TensorBoard(log_dir=log_dir)
    
    history = model.fit(X_train, y_train, epochs=200, callbacks=[tb_callback], validation_data=(X_test, y_test))
    
    # 5. Save Model
    model.save('sign_language_model.h5')
    print("Model saved as 'sign_language_model.h5'")
    
    # 6. Plot Results
    plot_history(history)

if __name__ == '__main__':
    main()
