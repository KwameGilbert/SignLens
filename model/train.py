"""
Training Script for SignLens Model
All settings are read from config.yaml - no hardcoded values.

Usage:
    python -m model.train
    
    or from project root:
    python model/train.py
"""
import os
import sys
import numpy as np
import matplotlib.pyplot as plt

# Add project root to path for imports
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from config.loader import ConfigLoader
from model.data_loader import DataLoader
from model.model import build_model, get_callbacks
from utils.logger import setup_logger
from tensorflow.keras.callbacks import Callback


class LivePlotCallback(Callback):
    """
    Keras callback for live plotting of training metrics.
    """
    def on_train_begin(self, logs=None):
        plt.ion()  # Turn on interactive mode
        self.fig, (self.ax1, self.ax2) = plt.subplots(1, 2, figsize=(12, 4))
        self.epochs = []
        self.acc = []
        self.val_acc = []
        self.loss = []
        self.val_loss = []
        
        self.fig.suptitle('SignLens Live Training Monitor', fontsize=14)
        plt.tight_layout()

    def on_epoch_end(self, epoch, logs=None):
        self.epochs.append(epoch + 1)
        self.acc.append(logs.get('categorical_accuracy'))
        self.val_acc.append(logs.get('val_categorical_accuracy'))
        self.loss.append(logs.get('loss'))
        self.val_loss.append(logs.get('val_loss'))

        # Clear axes
        self.ax1.clear()
        self.ax2.clear()

        # Accuracy Plot
        self.ax1.plot(self.epochs, self.acc, label='Train Acc', color='#1f77b4')
        self.ax1.plot(self.epochs, self.val_acc, label='Val Acc', color='#ff7f0e')
        self.ax1.set_title('Accuracy')
        self.ax1.set_xlabel('Epoch')
        self.ax1.set_ylabel('Score')
        self.ax1.legend(loc='lower right')
        self.ax1.grid(True, alpha=0.3)

        # Loss Plot
        self.ax2.plot(self.epochs, self.loss, label='Train Loss', color='#d62728')
        self.ax2.plot(self.epochs, self.val_loss, label='Val Loss', color='#9467bd')
        self.ax2.set_title('Loss')
        self.ax2.set_xlabel('Epoch')
        self.ax2.set_ylabel('Value')
        self.ax2.legend(loc='upper right')
        self.ax2.grid(True, alpha=0.3)

        plt.pause(0.1)  # Brief pause to allow update

    def on_train_end(self, logs=None):
        plt.ioff()  # Turn off interactive mode
        plt.show() # Keep window open at end


def plot_history(history, save_path: str):
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
    ax1.grid(True, alpha=0.3)
    
    # Loss
    ax2.plot(history.history['loss'], label='Train Loss')
    ax2.plot(history.history['val_loss'], label='Validation Loss')
    ax2.set_title('Model Loss')
    ax2.set_ylabel('Loss')
    ax2.set_xlabel('Epoch')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    print(f"📊 Training history saved to: {save_path}")
    plt.show()


def plot_confusion_matrix(y_true, y_pred, classes, save_path: str):
    """
    Computes and plots confusion matrix.
    """
    num_classes = len(classes)
    cm = np.zeros((num_classes, num_classes), dtype=int)
    
    y_true_indices = np.argmax(y_true, axis=1)
    y_pred_indices = np.argmax(y_pred, axis=1)
    
    for t, p in zip(y_true_indices, y_pred_indices):
        cm[t][p] += 1

    fig, ax = plt.subplots(figsize=(8, 8))
    cax = ax.matshow(cm, cmap=plt.cm.Blues)
    fig.colorbar(cax)
    
    ax.set_xticks(np.arange(num_classes))
    ax.set_yticks(np.arange(num_classes))
    ax.set_xticklabels(classes, rotation=45)
    ax.set_yticklabels(classes)
    
    for i in range(num_classes):
        for j in range(num_classes):
            ax.text(j, i, str(cm[i, j]), ha='center', va='center', 
                   color='white' if cm[i, j] > cm.max()/2 else 'black')
            
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    print(f"📊 Confusion matrix saved to: {save_path}")
    plt.show()


def train():
    """
    Train the sign language recognition model.
    All settings are read from config.yaml.
    """
    # Load configuration
    config = ConfigLoader.load_config()
    logger = setup_logger(config)
    
    # Get settings from config
    data_config = config.get('data_collection', {})
    sequence_length = data_config.get('sequence_length', 30)
    
    training_config = config.get('training', {})
    epochs = training_config.get('epochs', 200)
    batch_size = training_config.get('batch_size', 32)
    model_path = training_config.get('model_path', 'model/signlens.h5')
    log_dir = training_config.get('log_dir', 'Logs')
    
    print("=" * 50)
    print("SignLens Model Training")
    print("=" * 50)
    print(f"\nConfiguration:")
    print(f"  Epochs: {epochs}")
    print(f"  Batch Size: {batch_size}")
    print(f"  Sequence Length: {sequence_length}")
    print(f"  Model Path: {model_path}")
    logger.info("Starting model training")
    
    # 1. Load Data using DataLoader (reads augmentation settings from config)
    print("\n[1/4] Loading dataset...")
    loader = DataLoader(config)
    
    try:
        X_train, X_test, y_train, y_test = loader.prepare_data()
    except ValueError as e:
        print(f"\n❌ Error: {e}")
        print("\nTo train a model, you need at least 2 different sign classes.")
        logger.error(f"Training failed: {e}")
        return None
    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        print("\nNo data found! Please collect data first.")
        logger.error(f"Training failed: {e}")
        return None
    
    actions = loader.get_classes()
    num_classes = loader.get_num_classes()
    input_shape = (X_train.shape[1], X_train.shape[2])
    
    print(f"\nData shape: {X_train.shape}")
    print(f"Labels shape: {y_train.shape}")
    print(f"Number of classes: {num_classes}")
    logger.info(f"Dataset loaded: {len(X_train)} train, {len(X_test)} test, {num_classes} classes")
    
    # 2. Build Model (reads architecture settings from config)
    print("\n[2/4] Building model...")
    model = build_model(input_shape=input_shape, num_classes=num_classes, config=config)
    model.summary()
    
    # 3. Train
    print("\n[3/4] Starting training...")
    
    # Ensure directories exist
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    os.makedirs(log_dir, exist_ok=True)
    
    # Get callbacks (reads patience, lr settings from config)
    callbacks = get_callbacks(config)
    callbacks.append(LivePlotCallback())
    
    history = model.fit(
        X_train, y_train,
        epochs=epochs,
        batch_size=batch_size,
        callbacks=callbacks,
        validation_data=(X_test, y_test)
    )
    
    # 4. Evaluate
    print("\n[4/4] Evaluating model...")
    loss, accuracy = model.evaluate(X_test, y_test, verbose=0)
    print(f"\n✅ Final Test Accuracy: {accuracy * 100:.2f}%")
    print(f"   Final Test Loss: {loss:.4f}")
    logger.info(f"Training complete: accuracy={accuracy:.4f}, loss={loss:.4f}")
    
    # Plot Results
    try:
        model_dir = os.path.dirname(model_path)
        plot_history(history, os.path.join(model_dir, "training_history.png"))
        
        print("Generating Confusion Matrix...")
        y_pred = model.predict(X_test, verbose=0)
        plot_confusion_matrix(y_test, y_pred, actions, 
                             os.path.join(model_dir, "confusion_matrix.png"))
    except Exception as e:
        print(f"⚠️ Could not generate plots: {e}")
        logger.warning(f"Plot generation failed: {e}")
    
    print("\n" + "=" * 50)
    print("Training Complete!")
    print("=" * 50)
    print(f"\n📁 Model saved to: {model_path}")
    logger.info(f"Model saved to: {model_path}")
    
    return model, history


if __name__ == "__main__":
    train()
