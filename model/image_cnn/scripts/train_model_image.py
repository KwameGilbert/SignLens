import os
import numpy as np
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import TensorBoard, EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
import matplotlib.pyplot as plt
from model_image import get_image_model

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'dataset_images')
IMG_SIZE = (128, 128)
BATCH_SIZE = 2  # Reduced for small dataset
EPOCHS = 50

# Data generators
train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,  # Added validation split
    rotation_range=10,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True
)

train_gen = train_datagen.flow_from_directory(
    DATA_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',  # Use training subset
    shuffle=True
)

val_gen = train_datagen.flow_from_directory(
    DATA_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',  # Use validation subset
    shuffle=False
)

# Print number of images
print(f"Training images: {train_gen.samples}")
print(f"Validation images: {val_gen.samples}")

num_classes = train_gen.num_classes
input_shape = IMG_SIZE + (3,)

model = get_image_model(input_shape, num_classes)

log_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'Logs')
tb_callback = TensorBoard(log_dir=log_dir)
early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
# checkpoint = ModelCheckpoint(
#     os.path.join(os.path.dirname(__file__), 'best_sign_language_model_image.h5'),
#     monitor='val_categorical_accuracy',
#     save_best_only=True,
#     verbose=1
# )
lr_scheduler = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6, verbose=1)

# callbacks = [tb_callback, early_stopping, checkpoint, lr_scheduler]
callbacks = [tb_callback, early_stopping, lr_scheduler]

history = model.fit(
    train_gen,
    validation_data=val_gen,  # Added validation data
    epochs=EPOCHS,
    callbacks=callbacks
)

# Plot training & validation accuracy and loss
def plot_history(history):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    
    # Accuracy Plot
    ax1.plot(history.history['categorical_accuracy'], label='Train Accuracy')
    if 'val_categorical_accuracy' in history.history:
        ax1.plot(history.history['val_categorical_accuracy'], label='Val Accuracy')
    ax1.set_title('Model Accuracy')
    ax1.set_ylabel('Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.legend()
    
    # Loss Plot
    ax2.plot(history.history['loss'], label='Train Loss')
    if 'val_loss' in history.history:
        ax2.plot(history.history['val_loss'], label='Val Loss')
    ax2.set_title('Model Loss')
    ax2.set_ylabel('Loss')
    ax2.set_xlabel('Epoch')
    ax2.legend()
    
    plt.tight_layout()
    plt.show()


plot_history(history)

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

model_path = get_versioned_model_path(os.path.join(os.path.dirname(__file__), 'sign_language_model_image.h5'))
model.save(model_path)
print(f'Model saved to {model_path}')
