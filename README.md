# SignLens

A real-time Sign Language Detection application built with Python, OpenCV, and MediaPipe. This project uses the MediaPipe Holistic model to detect face, pose, and hand landmarks, extracting keypoints for sign language recognition using an LSTM neural network.

## 🚀 Features

- **Holistic Detection**: Simultaneously detects face, pose, and hand landmarks (1662 keypoints per frame).
- **LSTM-based Recognition**: Deep learning model learns temporal patterns in gesture sequences.
- **Real-time Performance**: Optimized for smooth real-time inference.
- **Multiple Recording Modes**: Keyboard, Automatic Timer, or Hybrid control.
- **Data Augmentation**: Built-in jitter and scaling augmentation for better generalization.
- **Configurable**: Fully customizable via `config/config.yaml`.
- **Modular Design**: Clean separation of concerns (Detector, UI, Utils, Model, Tools).
- **GUI/CLI Interface**: Flexible data recording interface.
- **FPS Counter**: Built-in performance monitoring.
- **Logging**: Comprehensive logging system for debugging and tracking.

## 🛠️ Tech Stack

- **Python 3.10+**
- **TensorFlow/Keras**: For LSTM model training and inference.
- **OpenCV**: For image processing and video capture.
- **MediaPipe**: For holistic landmark detection.
- **NumPy**: For numerical operations and keypoint manipulation.
- **scikit-learn**: For data splitting and preprocessing.
- **PyYAML**: For configuration management.
- **Matplotlib**: For training visualization.

## 📂 Project Structure

```
SignLens/
├── config/
│   ├── __init__.py          # Package init
│   ├── config.yaml          # Application configuration
│   └── loader.py            # Config loader singleton
├── detector/
│   ├── __init__.py          # Package init
│   ├── holistic_detector.py # MediaPipe Holistic wrapper
│   └── keypoints.py         # Keypoint extraction (1662 values)
├── model/
│   ├── __init__.py          # Package init
│   ├── data_loader.py       # Dataset loading and augmentation
│   ├── model.py             # LSTM model architecture
│   ├── predictor.py         # Real-time inference handler
│   ├── train.py             # Training script
│   ├── signlens.h5          # Trained model (generated)
│   └── metadata.json        # Model metadata (generated)
├── tools/
│   ├── gui.py               # GUI recorder interface
│   ├── menu.py              # CLI menu system
│   ├── live_recorder.py     # Webcam data recorder
│   ├── video_recorder.py    # Video file data extractor
│   └── inspect_dataset.py   # Dataset inspection utility
├── ui/
│   ├── __init__.py          # Package init
│   └── overlay.py           # UI drawing utilities
├── utils/
│   ├── __init__.py          # Package init
│   ├── fps_counter.py       # FPS calculation
│   └── logger.py            # Logging setup
├── dataset/                  # Training data (generated)
│   ├── A/                    # Sign class A
│   ├── B/                    # Sign class B
│   └── ...                   # More classes
├── logs/                     # Application logs (generated)
├── main.py                  # 🎯 Real-time inference entry point
├── record.py                # 🎯 Data recording entry point
├── requirements.txt         # Project dependencies
└── README.md                # This file
```

## 🔄 Workflow Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SignLens Pipeline                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. DATA COLLECTION (record.py)                                             │
│     └─▶ Webcam/Video → MediaPipe → Keypoints (1662) → .npy files           │
│                                                                             │
│  2. MODEL TRAINING (python -m model.train)                                  │
│     └─▶ Load .npy → Augment → Train LSTM → signlens.h5                     │
│                                                                             │
│  3. REAL-TIME INFERENCE (main.py)                                           │
│     └─▶ Webcam → MediaPipe → Keypoints → LSTM → Prediction → Display       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SignLens
   ```

2. **Create a Virtual Environment (Recommended)**

   **Windows:**

   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

   **macOS/Linux:**

   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 Usage

### Step 1: Collect Training Data

```bash
python record.py
```

This launches an interactive menu where you can:

- Choose recording mode (Keyboard, Automatic, Hybrid)
- Select class naming method
- Choose static vs dynamic gestures
- Set custom sequence lengths

**Recording Modes:**

- **Keyboard**: Press `R` to record, `S` to save, `N` for next class
- **Automatic**: Auto-records after countdown
- **Hybrid**: Countdown + manual control

### Step 2: Train the Model

```bash
python -m model.train
```

This will:

- Load all collected data from `dataset/`
- Apply data augmentation (jitter, scaling)
- Auto-select model architecture based on dataset size
- Train with early stopping and learning rate scheduling
- Save the best model to `model/signlens.h5`
- Generate training plots and confusion matrix

### Step 3: Run Real-Time Inference

```bash
python main.py
```

**Controls:**

- Press `q` to quit
- Press `c` to clear the buffer and reset

## 🔧 Configuration

The application is driven by `config/config.yaml`:

```yaml
# Camera Settings
camera:
  index: 0 # Webcam index
  width: 640 # Resolution width
  height: 480 # Resolution height

# MediaPipe Settings
mediapipe:
  min_detection_confidence: 0.5
  min_tracking_confidence: 0.5

# Data Collection Settings
data_collection:
  data_path: "dataset"
  sequence_length: 30 # Frames per sequence
  num_sequences: 30 # Sequences per sign

# Training Settings
training:
  epochs: 200
  test_size: 0.2
  model_path: "model/signlens.h5"

# Inference Settings
inference:
  prediction_threshold: 0.5 # Confidence threshold
  prediction_interval: 5 # Predict every N frames
  stability_buffer: 2 # Matching predictions required

# UI Settings
ui:
  show_fps: true
  show_landmarks: true
  window_name: "SignLens"
```

## 🧠 Model Architecture

The LSTM model processes sequences of 30 frames, each containing 1662 keypoints:

**Simple Model** (for < 100 samples/class):

```
Input (30, 1662) → LSTM(64) → Dense(32) → Output
```

**Standard Model** (for larger datasets):

```
Input (30, 1662) → LSTM(64) → LSTM(128) → LSTM(64) → Dense(64) → Dense(32) → Output
```

## 📊 Keypoint Breakdown

| Body Part  | Landmarks | Values per Landmark     | Total    |
| ---------- | --------- | ----------------------- | -------- |
| Face       | 468       | 3 (x, y, z)             | 1404     |
| Pose       | 33        | 4 (x, y, z, visibility) | 132      |
| Left Hand  | 21        | 3 (x, y, z)             | 63       |
| Right Hand | 21        | 3 (x, y, z)             | 63       |
| **Total**  | **543**   | -                       | **1662** |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

See the LICENSE file for details.
