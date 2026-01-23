# SignLens

A real-time Sign Language Detection application built with Python, OpenCV, and MediaPipe. This project uses the MediaPipe Holistic model to detect face, pose, and hand landmarks, extracting keypoints for sign language recognition using an LSTM neural network.

## 🚀 Features

- **Holistic Detection**: Simultaneously detects face, pose, and hand landmarks (1662 keypoints per frame).
- **LSTM-based Recognition**: Deep learning model learns temporal patterns in gesture sequences.
- **Real-time Performance**: Optimized for smooth real-time inference.
- **Multiple Recording Modes**: Keyboard, Automatic Timer, or Hybrid control.
- **Data Augmentation**: Built-in jitter (5%) and scaling (±10%) augmentation.
- **Configurable**: Fully customizable via `config/config.yaml`.
- **Modular Design**: Clean separation of concerns (Detector, UI, Utils, Model, Tools).

## 🛠️ Tech Stack

- **Python 3.10+**
- **TensorFlow/Keras**: For LSTM model training and inference.
- **OpenCV**: For image processing and video capture.
- **MediaPipe**: For holistic landmark detection.
- **NumPy**: For numerical operations and keypoint manipulation.
- **Matplotlib**: For training visualization.
- **PyYAML**: For configuration management.

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
│   └── keypoints.py         # Keypoint extraction [pose, face, lh, rh]
├── model/
│   ├── __init__.py          # Package init
│   ├── data_loader.py       # Dataset loading and augmentation
│   ├── model.py             # LSTM model architecture
│   ├── predictor.py         # Real-time inference handler
│   ├── train.py             # Training script
│   ├── signlens.h5          # Trained model (generated)
│   └── *.png                # Training plots (generated)
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
├── logs/                     # Application logs (generated)
├── Logs/                     # TensorBoard logs (generated)
├── main.py                  # 🎯 Real-time inference entry point
├── record.py                # 🎯 Data recording entry point
├── collect_data.py          # 📦 Standalone data collection
├── train_model.py           # 📦 Standalone training script
├── model.py                 # 📦 Standalone model definition
├── requirements.txt         # Project dependencies
└── README.md                # This file
```

## 🔄 Workflow Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SignLens Pipeline                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. DATA COLLECTION                                                         │
│     Option A: python collect_data.py    (standalone)                       │
│     Option B: python record.py          (modular with GUI/CLI)             │
│                                                                             │
│  2. MODEL TRAINING                                                          │
│     Option A: python train_model.py     (standalone → sign_language_model.h5)│
│     Option B: python -m model.train    (modular → model/signlens.h5)       │
│                                                                             │
│  3. REAL-TIME INFERENCE                                                     │
│     python main.py                      (uses modular components)          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SignLens
   ```

2. **Create a Virtual Environment**

   ```bash
   python -m venv venv
   venv\Scripts\activate   # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 Usage

### Step 1: Collect Training Data

**Option A - Standalone (Simple):**

```bash
python collect_data.py
# Enter sign name (e.g., "A")
# Records 30 sequences of 30 frames each
```

**Option B - Modular (GUI/CLI):**

```bash
python record.py          # CLI mode (default)
python record.py --gui    # GUI mode
```

### Step 2: Train the Model

**Option A - Standalone:**

```bash
python train_model.py
# Saves to: sign_language_model.h5
```

**Option B - Modular:**

```bash
python -m model.train
# Saves to: model/signlens.h5
```

### Step 3: Run Real-Time Inference

```bash
python main.py
```

**Controls:**

- Press `q` to quit
- Press `c` to clear the buffer and reset

## 🔧 Configuration

Edit `config/config.yaml` to customize:

```yaml
camera:
  index: 0 # Webcam index
  width: 640 # Resolution width
  height: 480 # Resolution height

mediapipe:
  min_detection_confidence: 0.5
  min_tracking_confidence: 0.5

training:
  epochs: 200
  test_size: 0.05 # 5% for testing
  model_path: "model/signlens.h5"

inference:
  prediction_threshold: 0.5
  prediction_interval: 5 # Predict every N frames
```

## 🧠 Model Architecture

```
Input (30 frames × 1662 keypoints)
    ↓
LSTM Layer 1 (64 units) + BatchNorm + Dropout(0.2)
    ↓
LSTM Layer 2 (128 units) + BatchNorm + Dropout(0.2)
    ↓
LSTM Layer 3 (64 units) + BatchNorm + Dropout(0.2)
    ↓
Dense Layer (64 units) + BatchNorm
    ↓
Dense Layer (32 units) + BatchNorm
    ↓
Output Layer (softmax, num_classes)
```

**Training Features:**

- CategoricalCrossentropy with Label Smoothing (0.1)
- Data Augmentation: Jitter (5%) + Scaling (±10%)
- EarlyStopping (patience=10)
- ReduceLROnPlateau
- ModelCheckpoint (saves best model)

## 📊 Keypoint Breakdown

| Body Part  | Landmarks | Values per Landmark     | Total    |
| ---------- | --------- | ----------------------- | -------- |
| Pose       | 33        | 4 (x, y, z, visibility) | 132      |
| Face       | 468       | 3 (x, y, z)             | 1404     |
| Left Hand  | 21        | 3 (x, y, z)             | 63       |
| Right Hand | 21        | 3 (x, y, z)             | 63       |
| **Total**  | **543**   | -                       | **1662** |

**Keypoint Order:** `[pose, face, left_hand, right_hand]`

## 📄 License

See the LICENSE file for details.
