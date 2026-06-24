from pydantic import BaseModel
from datetime import datetime

class HistoryBase(BaseModel):
    input_type: str
    prediction_label: str
    confidence: float

class HistoryCreate(HistoryBase):
    pass

class HistoryOut(HistoryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
