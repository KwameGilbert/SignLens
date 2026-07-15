from fastapi import APIRouter, Depends, File, UploadFile, WebSocket, WebSocketDisconnect, HTTPException, status
from .schemas import InputType, PredictResponse
from .auth import verify_api_key
from app.models.model_manager import model_manager
import numpy as np
import cv2
import mediapipe as mp
import base64
import json
import urllib.request
import urllib.error
import os

def predict_with_gemini(file_bytes: bytes, mime_type: str) -> str | None:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("[Warning] GEMINI_API_KEY environment variable is not set. Skipping Gemini fallback.")
        return None

    try:
        b64_data = base64.b64encode(file_bytes).decode("utf-8")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={api_key}"
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": (
                                "Identify the American Sign Language (ASL) alphabet letter (A-Z), "
                                "digit (1-10), or 'Neutral' shown in this media. "
                                "Output ONLY the single character, digit, or the word 'Neutral'. "
                                "Do not include any explanation, sentences, punctuation, or extra spaces."
                            )
                        },
                        {
                            "inlineData": {
                                "mimeType": mime_type,
                                "data": b64_data
                            }
                        }
                    ]
                }
            ]
        }
        
        req_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=req_data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            res_data = response.read().decode("utf-8")
            res_json = json.loads(res_data)
            
            candidates = res_json.get("candidates", [])
            if candidates:
                content = candidates[0].get("content", {})
                parts = content.get("parts", [])
                if parts:
                    text_result = parts[0].get("text", "").strip()
                    text_result = text_result.replace("\n", "").replace(".", "").strip()
                    print(f"[Gemini Response] Model: gemini-3.1-flash-lite, Label: {text_result}")
                    return text_result
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8") if e.fp else "No body"
        print(f"[Error] Gemini API HTTP Error: {e.code} - {e.reason}\nResponse Body: {error_body}")
    except Exception as e:
        import traceback
        print(f"[Error] Gemini prediction failed: {e}\n{traceback.format_exc()}")
    return None

router = APIRouter()



# REST endpoint for static image prediction

# Placeholder: update with your actual model filenames and class labels
IMAGE_MODEL_FILENAME = "image_model.h5"
VIDEO_MODEL_FILENAME = "video_model.h5"
# Static model classes (A-Z + Neutral)
STATIC_CLASSES = [chr(i) for i in range(ord('A'), ord('Z')+1)] + ['Neutral']
# The actual classes the video model was trained on (matching directory order in the dataset)
VIDEO_CLASSES = ['0', '1', '10', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Neutral', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

def image_predict(file_bytes: bytes):
    # Load model dynamically
    model = model_manager.get_model('image')
    import base64
    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        # Try treating it as a base64 string
        try:
            decoded_str = file_bytes.decode('utf-8')
            if "base64," in decoded_str:
                decoded_str = decoded_str.split("base64,")[1]
            raw_bytes = base64.b64decode(decoded_str)
            np_arr = np.frombuffer(raw_bytes, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        except Exception:
            pass

    if img is None:
        raise ValueError("Failed to decode image. Ensure the payload is a valid raw image file or base64 string.")

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    expected_features = model.input_shape[-1]
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
            
        if expected_features == 1662:
            face = np.zeros(468 * 3)
            if results.face_landmarks:
                face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten()
            keypoints = np.concatenate([pose, face, lh, rh])
        else:
            keypoints = np.concatenate([pose, lh, rh])
            
        x = np.expand_dims(keypoints, axis=0)
        preds = model.predict(x, verbose=0)
        
    pred_class = np.argmax(preds)
    confidence = float(np.max(preds))
    
    if confidence < 0.9:
        gemini_label = predict_with_gemini(file_bytes, "image/jpeg")
        if gemini_label:
            return {
                "prediction": gemini_label,
                "confidence": confidence,
                "fallback": True,
                "model_used": "Gemini-3.1-Flash-Lite"
            }
            
    if confidence < 0.5:
        return {
            "prediction": "Failed to predict sign. Please ensure your hands are clearly visible and try again.",
            "confidence": confidence,
            "fallback": False,
            "model_used": "Custom-CNN"
        }
        
    label = STATIC_CLASSES[pred_class] if pred_class < len(STATIC_CLASSES) else str(pred_class)
    return {"prediction": label, "confidence": confidence, "fallback": False, "model_used": "Custom-CNN"}


import tempfile
import os

def video_predict(file_bytes: bytes):
    # Load model dynamically
    model = model_manager.get_model('video')
    expected_features = model.input_shape[-1]
    
    # Save video bytes to a temporary file for OpenCV to read
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
        temp_video.write(file_bytes)
        temp_video_path = temp_video.name

    mp_holistic = mp.solutions.holistic
    
    sequence = []
    SEQUENCE_LENGTH = 30
    
    cap = cv2.VideoCapture(temp_video_path)
    
    frames = []
    
    with mp_holistic.Holistic(static_image_mode=False) as holistic:
        while cap.isOpened() and len(sequence) < SEQUENCE_LENGTH:
            ret, frame = cap.read()
            if not ret:
                break
            frames.append(frame)
                
            img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
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
                
            if expected_features == 1662:
                face = np.zeros(468 * 3)
                if results.face_landmarks:
                    face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten()
                keypoints = np.concatenate([pose, face, lh, rh])
            else:
                keypoints = np.concatenate([pose, lh, rh])
            sequence.append(keypoints)
            
    cap.release()
    try:
        os.remove(temp_video_path)
    except Exception:
        pass
    
    # If the video was too short, return Unknown
    if len(sequence) == 0:
        return {"prediction": "Unknown", "confidence": 0.0}
        
    # Pad if sequence is shorter than 30 frames
    while len(sequence) < SEQUENCE_LENGTH:
        sequence.append(np.zeros(expected_features))
        
    # Truncate if too long
    sequence = sequence[:SEQUENCE_LENGTH]
    
    input_data = np.expand_dims(sequence, axis=0)
    preds = model.predict(input_data, verbose=0)
    pred_class = np.argmax(preds)
    confidence = float(np.max(preds))
    
    # Prepare middle frame bytes for Gemini fallback
    middle_frame_bytes = None
    if frames:
        middle_idx = len(frames) // 2
        success, encoded_img = cv2.imencode('.jpg', frames[middle_idx])
        if success:
            middle_frame_bytes = encoded_img.tobytes()
            
    if confidence < 0.9:
        gemini_label = predict_with_gemini(
            middle_frame_bytes if middle_frame_bytes else file_bytes,
            "image/jpeg" if middle_frame_bytes else "video/mp4"
        )
        if gemini_label:
            return {
                "prediction": gemini_label,
                "confidence": confidence,
                "fallback": True,
                "model_used": "Gemini-3.1-Flash-Lite"
            }
            
    if confidence < 0.5:
        return {
            "prediction": "Failed to predict sign. Please ensure your hands are clearly visible and try again.",
            "confidence": confidence,
            "fallback": False,
            "model_used": "Custom-LSTM"
        }
        
    label = VIDEO_CLASSES[pred_class] if pred_class < len(VIDEO_CLASSES) else str(pred_class)
    
    return {"prediction": label, "confidence": confidence, "fallback": False, "model_used": "Custom-LSTM"}


@router.post("/predict", response_model=PredictResponse)
def predict_media(
    type: InputType,
    file: UploadFile = File(...)
    # api_key: str = Depends(verify_api_key)
):
    try:
        if type not in [InputType.image, InputType.video]:
            raise HTTPException(status_code=400, detail="This endpoint only supports type=image or type=video.")
        file_bytes = file.file.read()
        
        if type == InputType.image:
            result = image_predict(file_bytes)
        else:
            result = video_predict(file_bytes)
            
        return result
    except Exception as e:
        import traceback
        traceback_str = traceback.format_exc()
        print(f"[Error] Prediction handler failed:\n{traceback_str}")
        raise HTTPException(status_code=500, detail=traceback_str)

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
    # try:
    #     verify_api_key(api_key)
    # except HTTPException:
    #     await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
    #     return
    if type_ not in [InputType.video, InputType.stream]:
        await websocket.close(code=status.WS_1003_UNSUPPORTED_DATA)
        return
    try:
        model = model_manager.get_model(type_)
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
                
                expected_features = model.input_shape[-1]
                
                # Extract keypoints based on expected model input dimension
                pose = np.zeros(33 * 4)
                lh = np.zeros(21 * 3)
                rh = np.zeros(21 * 3)
                
                if results.pose_landmarks:
                    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten()
                if results.left_hand_landmarks:
                    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten()
                if results.right_hand_landmarks:
                    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten()
                
                if expected_features == 1662:
                    face = np.zeros(468 * 3)
                    if results.face_landmarks:
                        face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten()
                    keypoints = np.concatenate([pose, face, lh, rh])
                else:
                    keypoints = np.concatenate([pose, lh, rh])
                
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
    except Exception as e:
        import traceback
        print(f"[Error] Stream prediction failed:\n{traceback.format_exc()}")
        try:
            await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
        except Exception:
            pass
