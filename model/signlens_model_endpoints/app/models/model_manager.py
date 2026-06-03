import os
import glob
from tensorflow.keras.models import load_model
from threading import Lock

# Define base directory of the entire model project (assuming this file is in model/signlens_model_endpoints/app/models)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

MODEL_PATHS = {
    'image': os.path.join(PROJECT_ROOT, 'image', 'model_image_version', 'sign_language_model_image*.h5'),
    'video': os.path.join(PROJECT_ROOT, 'video_no_face', 'model_video_version_no_face', 'sign_language_model_video*.h5'),
    'stream': os.path.join(PROJECT_ROOT, 'video', 'model_video_version', 'sign_language_model_video*.h5')
}

# Thread-safe model loading
class ModelManager:
    def __init__(self):
        self.models = {}
        self.locks = {}

    def get_latest_model_path(self, model_type):
        if model_type not in MODEL_PATHS:
            raise ValueError(f"Unknown model type: {model_type}")
        pattern = MODEL_PATHS[model_type]
        files = glob.glob(pattern)
        if not files:
            raise FileNotFoundError(f"No models found matching pattern: {pattern}")
        # Sort files by modification time (most recent first)
        latest_file = max(files, key=os.path.getmtime)
        return latest_file

    def get_model(self, model_type):
        if model_type not in self.models:
            if model_type not in self.locks:
                self.locks[model_type] = Lock()
            with self.locks[model_type]:
                if model_type not in self.models:
                    model_path = self.get_latest_model_path(model_type)
                    print(f"Loading {model_type} model from: {model_path}")
                    self.models[model_type] = load_model(model_path, compile=False)
        return self.models[model_type]

model_manager = ModelManager()
