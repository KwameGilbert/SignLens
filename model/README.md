# SignLens

A real-time Sign Language Detection application built with Python, OpenCV, and MediaPipe. This project uses the MediaPipe Holistic model to detect face, pose, and hand landmarks, extracting keypoints for sign language recognition.

## 🚀 Features

- **Holistic Detection**: Simultaneously detects face, pose, and hand landmarks.
- **Real-time Performance**: Optimized for smooth real-time inference.
- **Configurable**: Fully customizable via `config/config.yaml`.
- **Modular Design**: Clean separation of concerns (Detector, UI, Utils).
- **FPS Counter**: Built-in performance monitoring.
- **Logging**: Comprehensive logging system for debugging and tracking.

## 🛠️ Tech Stack

- **Python 3.10.0**
- **OpenCV**: For image processing and video capture.
- **MediaPipe**: For holistic landmark detection.
- **NumPy**: For numerical operations and keypoint manipulation.
- **PyYAML**: For configuration management.

## 📂 Project Structure

```
sign/
├── config/
│   ├── config.yaml      # Application configuration
│   └── loader.py        # Config loader singleton
├── detector/
│   ├── holistic_detector.py # MediaPipe Holistic wrapper
│   └── keypoints.py     # Keypoint extraction logic
├── ui/
│   └── overlay.py       # UI drawing utilities
├── utils/
│   ├── fps_counter.py   # FPS calculation
│   └── logger.py        # Logging setup
├── main.py              # Application entry point
├── requirements.txt     # Project dependencies
└── README.md            # Project documentation
```

## ⚙️ Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd sign
    ```

2.  **Create a Virtual Environment (Recommended)**
    # Windows
    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```
    # macOS/Linux
    ```bash
    source venv/bin/activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

## 🚀 Usage

1.  **Configure the Application** (Optional)
    Edit `config/config.yaml` to adjust settings like camera index, resolution, or UI elements.

    ```yaml
    camera:
      index: 0        # Default webcam
      width: 1280     # Resolution width
      height: 720     # Resolution height
    ```

2.  **Run the Application**
    ```bash
    python main.py
    ```

3.  **Controls**
    - Press `q` to quit the application.

## 🔧 Configuration

The application is driven by `config/config.yaml`. Key sections include:

-   **app**: Basic app metadata.
-   **camera**: Camera settings (index, resolution).
-   **mediapipe**: Detection and tracking confidence thresholds.
-   **ui**: Toggles for FPS, status, and prediction overlays.
-   **logging**: Log file path and logging level (INFO, DEBUG, etc.).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

 - See the LICENSE file for details.
