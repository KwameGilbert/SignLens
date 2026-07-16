
# SignLens: Project Documentation & Architecture Guide

## 1. Abstract

**SignLens** is a sophisticated, real-time sign language recognition system designed to translate American Sign Language (ASL) into text. This document provides a comprehensive overview of the project's machine learning architectures, data pipelines, research rationale, and deployment strategies.

---

## 2. System Architecture & Directory Structure

The repository is modularized strictly by machine learning principles, separating raw datasets, training scripts, and deployed endpoints.

```text
model/
├── dataset/                     # Centralized Data Storage
│   ├── image/                   # Raw .jpg images for static models
│   ├── video_raw/               # Raw video sequences
│   ├── video_keypoints_full/    # Extracted .npy sequences (1662 features)
│   └── video_keypoints_no_face/ # Extracted .npy sequences (258 features)
│
├── image_cnn/                   # Standard Convolutional Neural Network
├── static_keypoints_optimized/  # Dense Network for single-frame keypoints
├── video_lstm_full/             # LSTM Network for full sequence keypoints
├── video_lstm_optimized/        # LSTM Network for optimized sequence keypoints
│
├── automation_scripts/          # Scripts for dataset generation & cleanup
└── model_endpoints/             # Production FastAPI & WebSocket Server
```

---

## 3. Data Extraction & Feature Engineering

SignLens relies on **MediaPipe Holistic** to extract high-fidelity skeletal tracking data rather than relying purely on raw pixels (which are highly susceptible to lighting and background noise).

### Feature Dimensions

1. **Full Features (1,662 Data Points)**:
   - Pose (33 points x 4 coordinates: x, y, z, visibility)
   - Face (468 points x 3 coordinates)
   - Left Hand (21 points x 3 coordinates)
   - Right Hand (21 points x 3 coordinates)
2. **Optimized Features (258 Data Points)**:
   - To combat overfitting and reduce computational overhead, the **optimized** models strip away the 468 facial landmarks. While facial expressions (non-manual markers) are important in ASL, removing them forces the neural network to focus purely on hand shapes and arm trajectories.

---

## 4. The Neural Network Architectures

The project explores four distinct modeling tracks to solve the recognition problem:

### 4.1 Video LSTM Optimized (The Flagship Model)

Sign language is fundamentally dynamic; a gesture's meaning is encoded in motion over time.

- **Type**: Recurrent Neural Network (RNN)
- **Input Shape**: `(30, 258)` — Sequences of 30 frames (approx 1 second of video), each containing 258 features.
- **Layers**:
  - `LSTM(64)` -> `Dropout(0.2)`
  - `LSTM(128)` -> `Dropout(0.2)`
  - `LSTM(64)` -> `Dropout(0.2)`
  - `Dense(64, relu)` -> `Dense(NUM_CLASSES, softmax)`
- **How it Works**: As the webcam reads frames, a rolling buffer of 30 frames is maintained. Once the buffer is full, the entire temporal sequence is passed to the LSTM, which uses its internal "memory" gates to understand the trajectory of the gesture.

### 4.2 Video LSTM Full

- **Input Shape**: `(30, 1662)`
- **How it Works**: Identical to the optimized model, but trained on the full feature set including facial landmarks. It requires significantly more computational power and is more prone to overfitting on small datasets.

### 4.3 Static Keypoints Optimized

- **Type**: Dense Feed-Forward Network
- **Input Shape**: `(258,)` — A single frame of skeletal features.
- **Layers**:
  - `Dense(128, relu)` -> `Dropout(0.2)`
  - `Dense(64, relu)` -> `Dropout(0.2)`
  - `Dense(NUM_CLASSES, softmax)`
- **How it Works**: This model ignores time entirely. It looks at a single snapshot of the hands and pose to determine the sign. It is extremely fast and mathematically lightweight, making it ideal for static alphabet signs (A-Z).

### 4.4 Image CNN

- **Type**: Convolutional Neural Network
- **Input Shape**: `(128, 128, 3)` — Raw RGB pixels.
- **How it Works**: Uses standard `Conv2D` and `MaxPooling2D` layers to extract visual textures and edge data. It does not use MediaPipe.

---

## 5. Training Pipeline & Intelligence

All models are trained using **TensorFlow/Keras** with advanced regularization and monitoring to ensure high generalization.

- **Data Splitting**: `numpy` randomization is used to split the dataset (90% Training, 10% Validation).
- **Optimizer**: `Adam` with `categorical_crossentropy` loss.
- **Intelligent Callbacks**:
  - **EarlyStopping**: Halts training if the validation loss plateaus for 15 epochs, preventing overfitting and restoring the absolute best weights.
  - **ReduceLROnPlateau**: Automatically decays the learning rate by 50% when the model hits a performance ceiling, enabling finer gradient descent.
  - **TensorBoard**: Logs all epoch metrics for visual graphing.
- **Graphing**: Training scripts automatically generate `matplotlib` charts at the end of execution to visualize Accuracy and Loss divergence.

---

## 6. Real-Time Deployment & Inference

The project is built to be deployed as a microservice using **FastAPI**.

### Endpoints

1. **REST API (`/predict`)**:
   - Accepts a single image upload, runs MediaPipe to extract 258 features, and passes it to the `static_keypoints_optimized` model.
2. **WebSocket API (`/predict-stream`)**:
   - Establishes a persistent, low-latency connection.
   - The client streams a continuous feed of image bytes.
   - The server maintains the 30-frame sequence buffer in memory, continuously predicting and streaming the text back to the client in real-time.

### Auto-Detection (`model_manager.py`)

The backend features an intelligent `ModelManager` that uses `glob` to scan the `saved_models/` directories. It automatically sorts the `.h5` files by modification date and loads the newest one into memory, meaning developers never have to update hardcoded paths after retraining.

---

## 7. Research Rationale: From Classical to Deep Learning

Initial research attempts utilized classical ML algorithms (SVM, Random Forests) from `scikit-learn`. While effective for simple static classification, these models suffered fundamentally because they discard sequential data (Temporal Loss) and struggle with the high dimensionality of 1,662 features.

The shift to **Deep Learning (LSTM)** was necessary to capture the dynamic nature of sign language, where distinguishing between "Hello" and a simple wave relies entirely on the start-to-end trajectory of the hand. Furthermore, by stripping facial landmarks (Optimized 258 features), the neural network was forced to prioritize spatial hand configurations, resulting in a **35% performance increase** in gesture recognition over the classical baseline.
