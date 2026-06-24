from fastapi import APIRouter
from app.api.api_v1 import auth, predict, history

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(predict.router, tags=["Prediction"])
router.include_router(history.router, prefix="/history", tags=["History"])
