import tensorflow as tf
print(f"TensorFlow Version: {tf.__version__}")
try:
    import tensorflow.keras
    print("tensorflow.keras found")
except ImportError:
    print("tensorflow.keras NOT found")

try:
    # pyrefly: ignore [missing-import]
    from tensorflow.keras.utils import to_categorical
    print("to_categorical found")
except ImportError as e:
    print(f"to_categorical import failed: {e}")
