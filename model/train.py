"""
Training Script for SignLens Model
Run this script to train the sign language recognition model.

Usage:
    python -m model.train
    
    or from project root:
    python model/train.py
"""
import os
import sys
import json
import numpy as np
import matplotlib.pyplot as plt

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from config.loader import ConfigLoader
from model.data_loader import DataLoader
from model.model import build_model, get_callbacks
from utils.logger import setup_logger


def plot_training_history(history, save_path: str = "training_history.png"):
    """
    Plot and save training history curves.
    
    Args:
        history: Keras training history object
        save_path: Path to save the plot
    """
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    
    # Accuracy
    ax1.plot(history.history['accuracy'], label='Train Accuracy')
    ax1.plot(history.history['val_accuracy'], label='Validation Accuracy')
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


def plot_confusion_matrix(y_true: np.ndarray, y_pred: np.ndarray, classes: list, save_path: str = "confusion_matrix.png"):
    """
    Plot and save confusion matrix.
    
    Args:
        y_true: True labels
        y_pred: Predicted labels (probabilities)
        classes: List of class names
        save_path: Path to save the plot
    """
    num_classes = len(classes)
    cm = np.zeros((num_classes, num_classes), dtype=int)
    
    y_pred_classes = np.argmax(y_pred, axis=1) if len(y_pred.shape) > 1 else y_pred
    
    for t, p in zip(y_true.astype(int), y_pred_classes.astype(int)):
        cm[t][p] += 1

    fig, ax = plt.subplots(figsize=(8, 8))
    cax = ax.matshow(cm, cmap=plt.cm.Blues)
    fig.colorbar(cax)
    
    ax.set_xticks(np.arange(num_classes))
    ax.set_yticks(np.arange(num_classes))
    ax.set_xticklabels(classes, rotation=45, ha='left')
    ax.set_yticklabels(classes)
    
    # Text Annotations
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


def train(config: dict = None, epochs: int = None, batch_size: int = None):
    """
    Train the sign language recognition model.
    
    Args:
        config: Configuration dictionary (loads from file if None)
        epochs: Override epochs from config
        batch_size: Override batch_size from config
    """
    # Load config if not provided
    if config is None:
        config = ConfigLoader.get_config()
    
    # Setup logger
    logger = setup_logger(config)
    
    # Get training settings
    dataset_path = config.get('data_collection', {}).get('data_path', 'dataset')
    sequence_length = config.get('data_collection', {}).get('sequence_length', 30)
    
    training_config = config.get('training', {})
    epochs = epochs or training_config.get('epochs', 100)
    batch_size = batch_size or training_config.get('batch_size', 32)
    test_size = training_config.get('test_size', 0.2)
    model_path = training_config.get('model_path', 'model/signlens.h5')
    
    print("=" * 50)
    print("SignLens Model Training")
    print("=" * 50)
    logger.info("Starting model training")
    
    # 1. Load Data
    print("\n[1/4] Loading dataset...")
    loader = DataLoader(dataset_path=dataset_path, sequence_length=sequence_length)
    
    try:
        X_train, X_test, y_train, y_test = loader.prepare_data(test_size=test_size)
    except ValueError as e:
        print(f"\n❌ Error: {e}")
        print("\nTo train a model, you need at least 2 different sign classes.")
        print("Use 'python record.py' to record more classes.")
        logger.error(f"Training failed: {e}")
        return None
    
    num_classes = loader.get_num_classes()
    input_shape = (X_train.shape[1], X_train.shape[2])  # (sequence_length, num_features)
    
    print(f"\nInput shape: {input_shape}")
    print(f"Number of classes: {num_classes}")
    logger.info(f"Dataset loaded: {len(X_train)} train, {len(X_test)} test, {num_classes} classes")
    
    # Determine model type based on dataset size
    samples_per_class = len(X_train) / num_classes
    model_type = "simple" if samples_per_class < 100 else "standard"
    print(f"Using {model_type} model architecture (avg {samples_per_class:.0f} samples/class)")
    
    # 2. Build Model
    print("\n[2/4] Building model...")
    model = build_model(input_shape, num_classes, model_type=model_type)
    model.summary()
    
    # 3. Train Model
    print("\n[3/4] Training model...")
    
    # Ensure model directory exists
    model_dir = os.path.dirname(model_path)
    if model_dir:
        os.makedirs(model_dir, exist_ok=True)
    
    callbacks = get_callbacks(model_path)
    
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=epochs,
        batch_size=batch_size,
        callbacks=callbacks,
        verbose=1
    )
    
    # 4. Evaluate Model
    print("\n[4/4] Evaluating model...")
    loss, accuracy = model.evaluate(X_test, y_test, verbose=0)
    print(f"\n✅ Final Test Accuracy: {accuracy * 100:.2f}%")
    print(f"   Final Test Loss: {loss:.4f}")
    logger.info(f"Training complete: accuracy={accuracy:.4f}, loss={loss:.4f}")
    
    # Save metadata
    metadata = {
        "classes": loader.classes,
        "label_map": loader.get_label_map(),
        "sequence_length": sequence_length,
        "input_shape": list(input_shape),
        "num_classes": num_classes,
        "accuracy": float(accuracy),
        "model_type": model_type
    }
    
    metadata_path = os.path.join(os.path.dirname(model_path), "metadata.json")
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n📁 Model saved to: {model_path}")
    print(f"📁 Metadata saved to: {metadata_path}")
    
    # Generate plots
    try:
        plot_training_history(history, os.path.join(os.path.dirname(model_path), "training_history.png"))
        
        y_pred = model.predict(X_test, verbose=0)
        plot_confusion_matrix(y_test, y_pred, loader.classes, 
                            os.path.join(os.path.dirname(model_path), "confusion_matrix.png"))
    except Exception as e:
        print(f"⚠️ Could not generate plots: {e}")
    
    print("\n" + "=" * 50)
    print("Training Complete!")
    print("=" * 50)
    
    return model, history


if __name__ == "__main__":
    train()
