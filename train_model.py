import numpy as np
import os

from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import TensorBoard, EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
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

def plot_confusion_matrix_manual(y_true, y_pred, classes):
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
    plt.show()

def augment_data(X, y):
    """
    Augments data by adding random noise (jitter) and scaling.
    Doubles the dataset size.
    """
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

def main():
    # 1. Load Data
    X, y, actions = load_data()
    
    if len(X) == 0:
        print("No data found! Please run collect_data.py first.")
        return

    # 1.5 Augment Data
    X, y = augment_data(X, y)

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
    
    # Callbacks
    log_dir = os.path.join('Logs')
    tb_callback = TensorBoard(log_dir=log_dir)
    
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, mode='min', restore_best_weights=True)
    checkpoint = ModelCheckpoint('sign_language_model.h5', monitor='val_categorical_accuracy', mode='max', save_best_only=True, verbose=1)
    lr_scheduler = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1)
    
    callbacks = [tb_callback, early_stopping, checkpoint, lr_scheduler]
    
    history = model.fit(X_train, y_train, epochs=200, callbacks=callbacks, validation_data=(X_test, y_test))
    
    # No need to save manually at end, checkpoint does it.
    # But for safety we can keep it or rely on checkpoint. 
    # Checkpoint is better.
    
    # 6. Plot Results
    plot_history(history)
    
    # 7. Plot Confusion Matrix
    print("Generating Confusion Matrix...")
    y_pred = model.predict(X_test)
    plot_confusion_matrix_manual(y_test, y_pred, actions)

if __name__ == '__main__':
    main()
