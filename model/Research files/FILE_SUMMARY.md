

# SignLens Project: Comprehensive File Documentation

This document provides an in-depth summary of every file in the SignLens workspace, including class/function signatures, step-by-step logic, data flow, configuration examples, and design choices.

---

## main.py
**Purpose:** Main entry point for the SignLens application. Orchestrates real-time sign language detection using a webcam.

**Class:**
```python
class SignLanguageDetector:
		def __init__(self):
		def main(self):
```

**Step-by-Step Logic:**
1. Loads configuration using `ConfigLoader.load_config()`.
2. Sets up logging with `setup_logger(config)`.
3. Initializes `HolisticDetector`, `FPSCounter`, and `UIOverlay` with config.
4. Opens camera at `config['camera']['index']` and sets resolution (`width`, `height`).
5. Main loop:
		- Captures frame from camera.
		- Detects landmarks: `detector.detect(frame)`.
		- Draws landmarks: `detector.draw_landmarks(image, results)`.
		- Extracts keypoints: `extract_keypoints(results)`.
		- Updates FPS: `fps_counter.update()` and gets FPS: `fps_counter.get_fps()`.
		- Draws overlays: `ui.draw_fps(image, fps)`, `ui.draw_status(image, ...)`.
		- Displays frame with `cv2.imshow()`.
		- Exits on 'q' key press.
6. Cleans up: releases camera, closes detector, destroys OpenCV windows.

**Data Flow:**
- Config is loaded and passed to all modules.
- Frames flow from camera → detector → UI overlay → display.
- Keypoints are extracted for further processing (e.g., ML, recognition).

**Design Choices:**
- Modular class-based design for extensibility and clarity.
- Centralized config and logging for maintainability.

---

## README.md
**Purpose:** Project documentation and user guide.

**Contents:**
- Project overview, features, and tech stack.
- Directory structure and file descriptions.
- Installation (virtual environment, pip install).
- Usage (configuring YAML, running main.py, controls).
- Example config:
```yaml
camera:
	index: 0
	width: 1280
	height: 720
```
- Contribution and license info.

**Design Choices:**
- Clear onboarding for new users and contributors.

---

## requirements.txt
**Purpose:** Specifies all Python packages required for the project.

**Dependencies:**
- `mediapipe==0.10.5`: Holistic detection (face, pose, hands).
- `opencv-python`: Video/image processing.
- `scikit-learn`: ML utilities.
- `matplotlib`: Visualization.
- `pyyaml`: Config parsing.
- `numpy`: Array operations.

**Design Choices:**
- Pinning `mediapipe` version for compatibility.

---

## config/config.yaml
**Purpose:** Centralized configuration for the application.

**Example Values:**
```yaml
app:
	name: "SignLens"
	version: "1.0"
camera:
	index: 0
	width: 1920
	height: 1080
mediapipe:
	detection_confidence: 0.5
	tracking_confidence: 0.5
ui:
	show_fps: true
	show_status: true
	show_prediction: false
logging:
	level: "INFO"
	file: "logs/app.log"
```

**Step-by-Step Usage:**
- All modules read their settings from this file via the config loader.
- Changing values here affects camera, UI, logging, and detection behavior.

**Design Choices:**
- YAML for human-readable, version-controllable config.

---

## config/loader.py
**Purpose:** Loads and caches configuration from YAML.

**Class:**
```python
class ConfigLoader:
		@classmethod
		def load_config(cls, config_path=None):
		@classmethod
		def get_config(cls):
```

**Step-by-Step Logic:**
1. Checks if config is already loaded; returns cached config if so.
2. Determines config path (default: `config/config.yaml`).
3. Loads YAML file and caches result.
4. Provides access via `get_config()`.
5. Raises error if config file is missing.

**Data Flow:**
- Singleton pattern ensures only one config instance is used throughout the app.

**Design Choices:**
- Class-based singleton for efficiency and consistency.

---

## detector/holistic_detector.py
**Purpose:** Wraps the MediaPipe Holistic model for detection and drawing.

**Class:**
```python
class HolisticDetector:
		def __init__(self, config):
		def detect(self, image):
		def draw_landmarks(self, image, results):
		def close(self):
```

**Step-by-Step Logic:**
1. Initializes MediaPipe Holistic model with config values for confidence.
2. `detect(image)`: Converts image to RGB, runs detection, converts back to BGR, returns image and results.
3. `draw_landmarks(image, results)`: Draws face, pose, left hand, right hand landmarks with custom colors and thicknesses.
4. `close()`: Releases model resources.

**Data Flow:**
- Receives frames from main loop, returns annotated frames and detection results.

**Design Choices:**
- Encapsulation of MediaPipe logic for reusability and clarity.

---

## detector/keypoints.py
**Purpose:** Extracts keypoints from holistic detection results.

**Function:**
```python
def extract_keypoints(results):
```

**Step-by-Step Logic:**
1. For each region (face, pose, left hand, right hand):
		- If landmarks exist, extract coordinates (x, y, z) and visibility (for pose).
		- If not, fill with zeros.
2. Flattens and concatenates all keypoints into a single NumPy array.
3. Returns the array for further processing.

**Data Flow:**
- Converts detection results into a format suitable for ML or storage.

**Design Choices:**
- Consistent output shape for downstream tasks.

---

## ui/overlay.py
**Purpose:** Draws UI overlays (FPS, status, prediction) on video frames.

**Class:**
```python
class UIOverlay:
		def __init__(self, config):
		def draw_fps(self, image, fps):
		def draw_status(self, image, text, color=(255,255,255)):
		def draw_prediction(self, image, label, probability):
```

**Step-by-Step Logic:**
1. Reads UI settings from config.
2. `draw_fps`: Draws FPS in green at top-left.
3. `draw_status`: Draws status message in white (or specified color).
4. `draw_prediction`: Draws prediction label and probability in orange.

**Data Flow:**
- Receives processed frames and overlays information for user feedback.

**Design Choices:**
- Modular UI overlays for extensibility and clarity.

---

## utils/fps_counter.py
**Purpose:** Calculates and tracks frames-per-second (FPS) for real-time video.

**Class:**
```python
class FPSCounter:
		def __init__(self):
		def update(self):
		def get_fps(self):
```

**Step-by-Step Logic:**
1. Tracks previous and current frame times.
2. `update()`: Updates time and computes FPS as inverse of time difference.
3. `get_fps()`: Returns current FPS as integer.

**Data Flow:**
- Used in main loop to monitor and display performance.

**Design Choices:**
- Simple, efficient FPS calculation for real-time feedback.

---

## utils/logger.py
**Purpose:** Sets up and configures logging for the application.

**Function:**
```python
def setup_logger(config):
```

**Step-by-Step Logic:**
1. Reads logging settings from config (file path, level).
2. Ensures log directory exists.
3. Creates logger with file and console handlers.
4. Formats log messages with timestamp, name, level, message.
5. Returns logger for use throughout the app.

**Data Flow:**
- Used by all modules to log status, errors, and debug information.

**Design Choices:**
- Centralized, configurable logging for maintainability.

---

## legacy/main1.py
**Purpose:** Legacy script for holistic detection and keypoint extraction. Serves as a prototype or reference implementation.

**Functions:**
```python
def mediapipe_detection(image, model):
def draw_styled_landmarks(image, results):
def extract_keypoints(results):
```

**Step-by-Step Logic:**
1. Initializes MediaPipe Holistic and drawing utilities.
2. Opens camera and enters main loop:
		- Captures frame.
		- Detects landmarks.
		- Draws landmarks.
		- Extracts and prints keypoint shapes for debugging.
		- Displays frame.
		- Exits on 'q' key press.
3. Releases camera and closes OpenCV windows.

**Data Flow:**
- Direct, procedural data flow for prototyping and testing.

**Design Choices:**
- Simple, non-modular script for rapid experimentation.

---

## Notes
- All modules are designed for modularity, clarity, and maintainability.
- Configuration is centralized in YAML for easy customization and consistency.
- Logging and UI overlays enhance debugging, monitoring, and user experience.
- The project is structured to allow easy extension, testing, and integration of new features (e.g., sign recognition, data collection).
