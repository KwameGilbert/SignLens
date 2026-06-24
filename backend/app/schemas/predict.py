from enum import Enum
from pydantic import BaseModel

class InputType(str, Enum):
    image = "image"
    video = "video"
    stream = "stream"

class PredictResponse(BaseModel):
    prediction: str
    confidence: float
