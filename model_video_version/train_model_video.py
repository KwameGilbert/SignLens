import os
import numpy as np
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import TensorBoard, EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
import matplotlib.pyplot as plt
from model_video import get_model

DATA_PATH = os.path.join('model_video_version', 'dataset_video')
SEQUENCE_LENGTH = 30

# Load data
def load_data():
    actions = np.array([folder for folder in os.listdir(DATA_PATH) if os.path.isdir(os.path.join(DATA_PATH, folder))])
    sequences, labels = [], []
    label_map = {label: num for num, label in enumerate(actions)}
    for action in actions:
        action_path = os.path.join(DATA_PATH, action)
        for file_name in os.listdir(action_path):
            if file_name.endswith('.npy'):
                window = np.load(os.path.join(action_path, file_name))
                sequences.append(window)
                labels.append(label_map[action])
    return np.array(sequences), to_categorical(labels).astype(int), actions

def plot_history(history):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    ax1.plot(history.history['categorical_accuracy'], label='Train Accuracy')
    ax1.plot(history.history['val_categorical_accuracy'], label='Validation Accuracy')
    ax1.set_title('Model Accuracy')
    ax1.set_ylabel('Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.legend()
    ax2.plot(history.history['loss'], label='Train Loss')
    ax2.plot(history.history['val_loss'], label='Validation Loss')
    ax2.set_title('Model Loss')
    ax2.set_ylabel('Loss')
    ax2.set_xlabel('Epoch')
    ax2.legend()
    plt.tight_layout()
    plt.show()

def main():
    X, y, actions = load_data()
    if len(X) == 0:
        print("No data found! Run extract_keypoints_from_videos.py first.")
        return
    indices = np.arange(len(X))
    np.random.shuffle(indices)
    X = X[indices]
    y = y[indices]
    train_size = 0.8
    val_size = 0.1
    train_split = int(len(X) * train_size)
    val_split = int(len(X) * (train_size + val_size))
    X_train, X_val, X_test = X[:train_split], X[train_split:val_split], X[val_split:]
    y_train, y_val, y_test = y[:train_split], y[train_split:val_split], y[val_split:]
    print(f"Training Data: {X_train.shape}")
    print(f"Validation Data: {X_val.shape}")
    print(f"Testing Data: {X_test.shape}")
    model = get_model(input_shape=(SEQUENCE_LENGTH, 1662), num_classes=actions.shape[0])
    log_dir = os.path.join('model_video_version', 'Logs')
    tb_callback = TensorBoard(log_dir=log_dir)
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, mode='min', restore_best_weights=True)
    # Versioned model saving
    def get_versioned_model_path(base_path):
        if not os.path.exists(base_path):
            return base_path
        base, ext = os.path.splitext(base_path)
        version = 1
        while True:
            new_path = f"{base}_{version}{ext}"
            if not os.path.exists(new_path):
                return new_path
            version += 1

    model_path = get_versioned_model_path(os.path.join('model_video_version', 'sign_language_model_video.h5'))
    checkpoint = ModelCheckpoint(model_path, monitor='val_categorical_accuracy', mode='max', save_best_only=True, verbose=1)
    lr_scheduler = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1)
    callbacks = [tb_callback, early_stopping, checkpoint, lr_scheduler]
    history = model.fit(X_train, y_train, epochs=200, callbacks=callbacks, validation_data=(X_val, y_val))
    plot_history(history)
    print("\nEvaluating on Test Set...")
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
    print(f"Test Loss: {test_loss:.4f}")
    print(f"Test Accuracy: {test_accuracy:.4f}")

if __name__ == '__main__':
    main()
