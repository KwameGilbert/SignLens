import os
import numpy as np
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import TensorBoard, EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
import matplotlib.pyplot as plt
from model_image import get_image_model

DATA_PATH = os.path.join('../dataset_images')
IMG_SIZE = (128, 128)
BATCH_SIZE = 2  # Reduced for small dataset
EPOCHS = 50

# Data generators
train_datagen = ImageDataGenerator(
    rescale=1./255,
    # validation_split=0.2,  # Commented out for training only
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
    shuffle=True
)

# val_gen and validation split are commented out for training only

# Print number of images in training set only
print(f"Training images: {train_gen.samples}")

num_classes = train_gen.num_classes
input_shape = IMG_SIZE + (3,)

model = get_image_model(input_shape, num_classes)

log_dir = os.path.join('model_image_version', 'Logs')
tb_callback = TensorBoard(log_dir=log_dir)

# Remove validation-dependent callbacks
callbacks = [tb_callback]

history = model.fit(
    train_gen,
    epochs=EPOCHS,
    callbacks=callbacks
)

# Only plot training accuracy and loss
def plot_history(history):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    ax1.plot(history.history['categorical_accuracy'], label='Train Accuracy')
    ax1.set_title('Model Accuracy')
    ax1.set_ylabel('Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.legend()
    ax2.plot(history.history['loss'], label='Train Loss')
    ax2.set_title('Model Loss')
    ax2.set_ylabel('Loss')
    ax2.set_xlabel('Epoch')
    ax2.legend()
    plt.tight_layout()
    plt.show()


plot_history(history)

# Save the trained model manually
model.save('model_image_version/sign_language_model_image.h5')
print('Model saved to model_image_version/sign_language_model_image.h5')
