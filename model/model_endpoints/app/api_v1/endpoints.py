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
# Static model classes (A-Z + Neutral)
STATIC_CLASSES = [chr(i) for i in range(ord('A'), ord('Z')+1)] + ['Neutral']
VIDEO_CLASSES = [chr(i) for i in range(ord('A'), ord('Z')+1)] + [str(i) for i in range(1, 11)]

def image_predict(file_bytes: bytes):
    # Load model dynamically
    model = model_manager.get_model('image')
    # Preprocess image
    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    import mediapipe as mp
    mp_holistic = mp.solutions.holistic
    with mp_holistic.Holistic(static_image_mode=True) as holistic:
        results = holistic.process(img_rgb)
        
        pose = np.zeros(33 * 4)
        lh = np.zeros(21 * 3)
        rh = np.zeros(21 * 3)
        
        if results.pose_landmarks:
            pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten()
        if results.left_hand_landmarks:
            lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten()
        if results.right_hand_landmarks:
            rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten()
            
        keypoints = np.concatenate([pose, lh, rh]) # 258 features
        x = np.expand_dims(keypoints, axis=0)
        preds = model.predict(x, verbose=0)
        
    pred_class = np.argmax(preds)
    confidence = float(np.max(preds))
    label = STATIC_CLASSES[pred_class] if pred_class < len(STATIC_CLASSES) else str(pred_class)
    return {"prediction": label, "confidence": confidence}


@router.post("/predict", response_model=PredictResponse)
def predict_image(
    type: InputType,
    file: UploadFile = File(...),
    api_key: str = Depends(verify_api_key)
):
    if type != InputType.image:
        raise HTTPException(status_code=400, detail="This endpoint only supports type=image.")
    file_bytes = file.file.read()
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
        model = model_manager.get_model(type_)
        import mediapipe as mp
        mp_holistic = mp.solutions.holistic
        
        sequence = []
        SEQUENCE_LENGTH = 30
        
        with mp_holistic.Holistic(static_image_mode=False) as holistic:
            while True:
                frame_bytes = await websocket.receive_bytes()
                # Decode image from bytes (assume JPEG/PNG)
                np_arr = np.frombuffer(frame_bytes, np.uint8)
                img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
                if img is None:
                    await websocket.send_json({"error": "Invalid image/frame data"})
                    continue
                    
                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                results = holistic.process(img_rgb)
                
                # Extract keypoints based on type
                pose = np.zeros(33 * 4)
                face = np.zeros(468 * 3)
                lh = np.zeros(21 * 3)
                rh = np.zeros(21 * 3)
                
                if results.pose_landmarks:
                    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten()
                if results.left_hand_landmarks:
                    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten()
                if results.right_hand_landmarks:
                    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten()
                
                if type_ == "stream":
                    if results.face_landmarks:
                        face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten()
                    keypoints = np.concatenate([pose, face, lh, rh]) # 1662 features
                else:
                    keypoints = np.concatenate([pose, lh, rh]) # 258 features
                
                sequence.append(keypoints)
                if len(sequence) > SEQUENCE_LENGTH:
                    sequence = sequence[-SEQUENCE_LENGTH:]
                    
                if len(sequence) == SEQUENCE_LENGTH:
                    input_data = np.expand_dims(sequence, axis=0)
                    preds = model.predict(input_data, verbose=0)
                    pred_class = np.argmax(preds)
                    confidence = float(np.max(preds))
                    label = VIDEO_CLASSES[pred_class] if pred_class < len(VIDEO_CLASSES) else str(pred_class)
                    result = {"prediction": label, "confidence": confidence}
                    await websocket.send_json(result)
                else:
                    await websocket.send_json({"status": f"Buffering... {len(sequence)}/{SEQUENCE_LENGTH}"})
                    
    except WebSocketDisconnect:
        pass
