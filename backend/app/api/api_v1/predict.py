import json
import logging
from fastapi import APIRouter, Depends, File, UploadFile, WebSocket, WebSocketDisconnect, HTTPException, status
from sqlalchemy.orm import Session
import httpx
import websockets

from app.api import deps
from app.core.database import get_db
from app.config import settings
from app.models.user import User
from app.models.history import History
from app.schemas.predict import InputType, PredictResponse

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/predict", response_model=PredictResponse)
async def predict_image(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Proxy static image prediction to ML Model Endpoints, log result in user history, and return prediction.
    """
    # Prepare files and headers for forwarding to ML endpoints
    files = {"file": (file.filename, await file.read(), file.content_type)}
    headers = {"x-api-key": settings.MODEL_API_KEY}
    params = {"type": "image"}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{settings.MODEL_API_URL}/api/v1/predict",
                files=files,
                headers=headers,
                params=params,
                timeout=10.0
            )
        except httpx.RequestError as exc:
            logger.error(f"Error querying model endpoint: {exc}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="ML Model Server is unreachable."
            )
            
    if response.status_code != 200:
        logger.error(f"Model endpoint returned error {response.status_code}: {response.text}")
        raise HTTPException(
            status_code=response.status_code,
            detail=f"ML Model Server Error: {response.text}"
        )
        
    result = response.json()
    prediction_label = result.get("prediction")
    confidence = result.get("confidence")
    
    # Save to user's history
    history_entry = History(
        user_id=current_user.id,
        input_type="image",
        prediction_label=prediction_label,
        confidence=confidence
    )
    db.add(history_entry)
    db.commit()
    
    return PredictResponse(prediction=prediction_label, confidence=confidence)


@router.websocket("/predict-stream")
async def predict_stream(websocket: WebSocket, db: Session = Depends(get_db)):
    """
    WebSocket proxy that relays real-time video/stream frames from mobile client to ML model endpoints,
    validates the JWT token, and logs predictions.
    """
    await websocket.accept()
    
    # Extract JWT token and stream type from query parameters
    params = websocket.query_params
    token = params.get("token")
    stream_type = params.get("type", "stream") # stream (1662 features) or video (258 features)
    
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Missing token")
        return
        
    if stream_type not in ["stream", "video"]:
        await websocket.close(code=status.WS_1003_UNSUPPORTED_DATA, reason="Invalid stream type")
        return
        
    # Authenticate token and get current user
    try:
        current_user = deps.get_current_user(db=db, token=token)
    except HTTPException as exc:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason=exc.detail)
        return
        
    # Establish connection to downstream ML model endpoints WebSocket
    ml_ws_url = f"{settings.MODEL_API_WS_URL}/api/v1/predict-stream?api_key={settings.MODEL_API_KEY}&type={stream_type}"
    
    try:
        async with websockets.connect(ml_ws_url) as ml_ws:
            # Relay client frames and ML predictions
            async def client_to_ml():
                try:
                    while True:
                        # Receive frame bytes from mobile app
                        frame_bytes = await websocket.receive_bytes()
                        # Forward directly to ML endpoints
                        await ml_ws.send(frame_bytes)
                except WebSocketDisconnect:
                    pass
                except Exception as e:
                    logger.warning(f"Error in client_to_ml: {e}")
                    
            async def ml_to_client():
                last_logged_sign = None
                try:
                    while True:
                        # Receive prediction JSON from ML endpoints
                        ml_response_text = await ml_ws.recv()
                        ml_response = json.loads(ml_response_text)
                        
                        # Forward prediction back to mobile app
                        await websocket.send_json(ml_response)
                        
                        # Log high-confidence predictions to database when the sign changes
                        prediction_label = ml_response.get("prediction")
                        confidence = ml_response.get("confidence")
                        
                        if prediction_label and confidence and confidence > 0.8:
                            if prediction_label != last_logged_sign:
                                # Save to history
                                history_entry = History(
                                    user_id=current_user.id,
                                    input_type=stream_type,
                                    prediction_label=prediction_label,
                                    confidence=confidence
                                )
                                db.add(history_entry)
                                db.commit()
                                last_logged_sign = prediction_label
                except websockets.exceptions.ConnectionClosed:
                    pass
                except Exception as e:
                    logger.warning(f"Error in ml_to_client: {e}")
            
            import asyncio
            # Run both tasks concurrently
            await asyncio.gather(client_to_ml(), ml_to_client())
            
    except Exception as e:
        logger.error(f"Failed to connect to ML server WebSocket: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR, reason="ML Server unreachable")
