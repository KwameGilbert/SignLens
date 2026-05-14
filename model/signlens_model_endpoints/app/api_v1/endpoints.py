from fastapi import APIRouter, Depends, File, UploadFile, WebSocket, WebSocketDisconnect, HTTPException, status
from .schemas import InputType, PredictResponse
from .auth import verify_api_key
from app.models.model_manager import model_manager
import numpy as np
import cv2
from tensorflow.keras.preprocessing import image as keras_image


router = APIRouter()



# REST endpoint for static image prediction

# Placeholder: update with your actual model filenames and class labels
IMAGE_MODEL_FILENAME = "image_model.h5"
VIDEO_MODEL_FILENAME = "video_model.h5"
IMAGE_CLASSES = [chr(i) for i in range(ord('A'), ord('Z')+1)]  # ['A', ..., 'Z']
VIDEO_CLASSES = [chr(i) for i in range(ord('A'), ord('Z')+1)] + [str(i) for i in range(1, 11)]

def image_predict(file_bytes: bytes):
    # Load model
    model = model_manager.get_model(IMAGE_MODEL_FILENAME)
    # Preprocess image (assuming 128x128 RGB)
    img = keras_image.load_img(
        path=None,
        file=file_bytes,
        target_size=(128, 128),
        color_mode='rgb'
    )
    x = keras_image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = x / 255.0
    preds = model.predict(x)
    pred_class = np.argmax(preds)
    confidence = float(np.max(preds))
    label = IMAGE_CLASSES[pred_class] if pred_class < len(IMAGE_CLASSES) else str(pred_class)
    return {"prediction": label, "confidence": confidence}


@router.post("/predict", response_model=PredictResponse)
def predict_image(
    type: InputType,
    file: UploadFile = File(...),
    api_key: str = Depends(verify_api_key)
):
    if type != InputType.image:
        raise HTTPException(status_code=400, detail="This endpoint only supports type=image.")
    file_bytes = file.file
    result = image_predict(file_bytes)
    return result

# WebSocket endpoint for video/stream prediction
@router.websocket("/predict-stream")
async def predict_stream(websocket: WebSocket):
    # API key and type must be provided as query params
    await websocket.accept()
    params = websocket.query_params
    api_key = params.get("api_key")
    type_ = params.get("type")
    if not api_key or not type_:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    try:
        verify_api_key(api_key)
    except HTTPException:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    if type_ not in [InputType.video, InputType.stream]:
        await websocket.close(code=status.WS_1003_UNSUPPORTED_DATA)
        return
    try:
        model = model_manager.get_model(VIDEO_MODEL_FILENAME)
        while True:
            frame_bytes = await websocket.receive_bytes()
            # Decode image from bytes (assume JPEG/PNG)
            np_arr = np.frombuffer(frame_bytes, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            if img is None:
                await websocket.send_json({"error": "Invalid image/frame data"})
                continue
            # Preprocess for Keras model (resize, normalize)
            img = cv2.resize(img, (128, 128))
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            x = np.expand_dims(img, axis=0)
            x = x / 255.0
            preds = model.predict(x)
            pred_class = np.argmax(preds)
            confidence = float(np.max(preds))
            label = VIDEO_CLASSES[pred_class] if pred_class < len(VIDEO_CLASSES) else str(pred_class)
            result = {"prediction": label, "confidence": confidence}
            await websocket.send_json(result)
    except WebSocketDisconnect:
        pass
