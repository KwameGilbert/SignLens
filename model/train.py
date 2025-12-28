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

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from model.data_loader import DataLoader
from model.model import build_model, get_callbacks


def train(dataset_path="dataset", sequence_length=30, epochs=100, batch_size=32):
    """
    Train the sign language recognition model.
    
    Args:
        dataset_path: Path to dataset folder
        sequence_length: Number of frames per sequence
        epochs: Maximum training epochs
        batch_size: Training batch size
    """
    print("=" * 50)
    print("SignLens Model Training")
    print("=" * 50)
    
    # 1. Load Data
    print("\n[1/4] Loading dataset...")
    loader = DataLoader(dataset_path=dataset_path, sequence_length=sequence_length)
    
    try:
        X_train, X_test, y_train, y_test = loader.prepare_data(test_size=0.2)
    except ValueError as e:
        print(f"\n❌ Error: {e}")
        print("\nTo train a model, you need at least 2 different sign classes.")
        print("Use 'python record.py' to record more classes.")
        return None
    
    num_classes = loader.get_num_classes()
    input_shape = (X_train.shape[1], X_train.shape[2])  # (sequence_length, num_features)
    
    print(f"\nInput shape: {input_shape}")
    print(f"Number of classes: {num_classes}")
    
    # 2. Build Model
    print("\n[2/4] Building model...")
    model = build_model(input_shape, num_classes)
    model.summary()
    
    # 3. Train Model
    print("\n[3/4] Training model...")
    model_dir = os.path.join(project_root, "model")
    os.makedirs(model_dir, exist_ok=True)
    
    model_path = os.path.join(model_dir, "signlens.keras")
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
    
    # Save metadata
    metadata = {
        "classes": loader.classes,
        "label_map": loader.get_label_map(),
        "sequence_length": sequence_length,
        "input_shape": list(input_shape),
        "num_classes": num_classes,
        "accuracy": float(accuracy)
    }
    
    metadata_path = os.path.join(model_dir, "metadata.json")
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n📁 Model saved to: {model_path}")
    print(f"📁 Metadata saved to: {metadata_path}")
    print("\n" + "=" * 50)
    print("Training Complete!")
    print("=" * 50)
    
    return model, history


if __name__ == "__main__":
    # Train with default settings
    train(
        dataset_path="dataset",
        sequence_length=30,
        epochs=100,
        batch_size=32
    )
