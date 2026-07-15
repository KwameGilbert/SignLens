import requests
import json
import os
import cv2
import numpy as np
import tempfile

BASE_URL = "https://signlens-ml-models.onrender.com"
# BASE_URL = "http://127.0.0.1:8000"  # For local testing if needed

# You can replace this with your actual API key if you know it
# If the db is disconnected on render, it might return a 500
API_KEY = "de4e5d334a7b869f873fbd2aa3c29a1eba600d2b0d5bc3f011e73f7e5f1e1e27" 

def test_image_predict():
    print("Testing /api/v1/predict with type=image...")
    url = f"{BASE_URL}/api/v1/predict"
    
    # Create a dummy image
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    _, img_encoded = cv2.imencode('.jpg', img)
    
    headers = {
        "x-api-key": API_KEY
    }
    params = {
        "type": "image"
    }
    files = {
        "file": ("test_image.jpg", img_encoded.tobytes(), "image/jpeg")
    }
    
    try:
        response = requests.post(url, headers=headers, params=params, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

def test_video_predict():
    print("\nTesting /api/v1/predict with type=video...")
    url = f"{BASE_URL}/api/v1/predict"
    
    # Create a dummy video
    with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as tmp:
        tmp_path = tmp.name
        
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(tmp_path, fourcc, 20.0, (640, 480))
    for _ in range(10): # 10 frames
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        out.write(frame)
    out.release()
    
    headers = {
        "x-api-key": API_KEY
    }
    params = {
        "type": "video"
    }
    
    with open(tmp_path, 'rb') as f:
        files = {
            "file": ("test_video.mp4", f.read(), "video/mp4")
        }
        try:
            response = requests.post(url, headers=headers, params=params, files=files)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
        except Exception as e:
            print(f"Request failed: {e}")
            
    os.remove(tmp_path)

if __name__ == "__main__":
    print(f"Connecting to: {BASE_URL}")
    test_image_predict()
    test_video_predict()
