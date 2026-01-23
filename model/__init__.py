"""
SignLens ML Model Package

This package contains the machine learning components:
- model.py: LSTM model architecture (config-driven)
- data_loader.py: Dataset loading and augmentation (config-driven)
- predictor.py: Real-time inference (config-driven)
- train.py: Training script (config-driven)

All components read their settings from config/config.yaml.
"""

from .model import build_model, get_callbacks
from .data_loader import DataLoader
from .predictor import SignPredictor

__all__ = ['build_model', 'get_callbacks', 'DataLoader', 'SignPredictor']
