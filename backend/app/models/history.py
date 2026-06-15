from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    input_type = Column(String(50), nullable=False)  # image, video, stream
    prediction_label = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to user
    user = relationship("User", back_populates="history")
