import os
from tensorflow.keras.models import load_model
from threading import Lock

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

# Thread-safe model loading
class ModelManager:
    def __init__(self):
        self.models = {}
        self.locks = {}

    def get_model(self, model_name):
        if model_name not in self.models:
            if model_name not in self.locks:
                self.locks[model_name] = Lock()
            with self.locks[model_name]:
                if model_name not in self.models:
                    model_path = os.path.join(MODEL_DIR, model_name)
                    self.models[model_name] = load_model(model_path)
        return self.models[model_name]

model_manager = ModelManager()
