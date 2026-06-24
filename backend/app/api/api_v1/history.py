from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.core.database import get_db
from app.models.history import History
from app.schemas.history import HistoryOut, HistoryCreate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[HistoryOut])
def read_history(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve translation history logs for the current user.
    """
    history_logs = (
        db.query(History)
        .filter(History.user_id == current_user.id)
        .order_by(History.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return history_logs

@router.post("/", response_model=HistoryOut, status_code=status.HTTP_201_CREATED)
def create_history_entry(
    *,
    db: Session = Depends(get_db),
    history_in: HistoryCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Manually log a translation history entry.
    """
    db_history = History(
        user_id=current_user.id,
        input_type=history_in.input_type,
        prediction_label=history_in.prediction_label,
        confidence=history_in.confidence,
    )
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history
