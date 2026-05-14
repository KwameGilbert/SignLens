import os
import numpy as np
# pyrefly: ignore [missing-import]
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import TensorBoard, EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from model_fusion import get_fusion_model

# Paths to pre-trained models
IMAGE_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'image', 'model_image_version', 'sign_language_model_image.h5')
VIDEO_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'video', 'model_video_version', 'sign_language_model_video.h5')
KEYPOINT_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'keypoints', 'model_keypoint_version', 'sign_language_model_keypoint.h5')

# Example: You must implement your own data loader to provide X_image, X_video, X_keypoint, y
# X_image: (num_samples, 128, 128, 3)
# X_video: (num_samples, 30, 1662)
# X_keypoint: (num_samples, 30, 1662)
# y: (num_samples, num_classes)

def load_fusion_data():
    # Placeholder: Replace with your own logic to align and load data for all three modalities
    # For demonstration, returns random arrays
    num_samples = 100
    num_classes = 20
    X_image = np.random.rand(num_samples, 128, 128, 3)
    X_video = np.random.rand(num_samples, 30, 1662)
    X_keypoint = np.random.rand(num_samples, 30, 1662)
    y = to_categorical(np.random.randint(0, num_classes, num_samples), num_classes)
    return X_image, X_video, X_keypoint, y, num_classes

def main():
    X_image, X_video, X_keypoint, y, num_classes = load_fusion_data()
    model = get_fusion_model(IMAGE_MODEL_PATH, VIDEO_MODEL_PATH, KEYPOINT_MODEL_PATH, num_classes)
    log_dir = os.path.join(os.path.dirname(__file__), '..', 'Logs')
    tb_callback = TensorBoard(log_dir=log_dir)
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, mode='min', restore_best_weights=True)
    checkpoint = ModelCheckpoint(os.path.join(os.path.dirname(__file__), 'sign_language_model_fusion.h5'), monitor='val_categorical_accuracy', mode='max', save_best_only=True, verbose=1)
    lr_scheduler = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1)
    callbacks = [tb_callback, early_stopping, checkpoint, lr_scheduler]
    # Split data
    indices = np.arange(len(X_image))
    np.random.shuffle(indices)
    X_image, X_video, X_keypoint, y = X_image[indices], X_video[indices], X_keypoint[indices], y[indices]
    train_size = int(0.8 * len(X_image))
    val_size = int(0.1 * len(X_image))
    X_img_train, X_img_val, X_img_test = X_image[:train_size], X_image[train_size:train_size+val_size], X_image[train_size+val_size:]
    X_vid_train, X_vid_val, X_vid_test = X_video[:train_size], X_video[train_size:train_size+val_size], X_video[train_size+val_size:]
    X_key_train, X_key_val, X_key_test = X_keypoint[:train_size], X_keypoint[train_size:train_size+val_size], X_keypoint[train_size+val_size:]
    y_train, y_val, y_test = y[:train_size], y[train_size:train_size+val_size], y[train_size+val_size:]
    # Train
    model.fit([X_img_train, X_vid_train, X_key_train], y_train, epochs=100, batch_size=16, validation_data=([X_img_val, X_vid_val, X_key_val], y_val), callbacks=callbacks)
    # Evaluate
    test_loss, test_acc = model.evaluate([X_img_test, X_vid_test, X_key_test], y_test, verbose=0)
    print(f"Test Loss: {test_loss:.4f}")
    print(f"Test Accuracy: {test_acc:.4f}")

if __name__ == '__main__':
    main()
