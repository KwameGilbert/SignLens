import requests
import os
import json
import numpy as np
import cv2

BASE_URL = "http://127.0.0.1:8000/api/v1/predict"

print("========================================")
print("   SignLens Backend Simulator           ")
print("========================================\n")

# Setup Test Files
dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset"))
video_file = os.path.join(dataset_dir, "video_raw", "A", "A_Front_sync_0.mp4")

# Generate a dummy image in memory if we can't find a real one
def get_dummy_image_bytes():
    # Create a simple blank image
    img = np.zeros((128, 128, 3), dtype=np.uint8)
    _, buffer = cv2.imencode('.jpg', img)
    return buffer.tobytes()

# ----------------------------------------
# Test 1: Image Prediction
# ----------------------------------------
print("1. Testing POST /api/v1/predict?type=image")
try:
    files = {'file': ('test_image.jpg', get_dummy_image_bytes(), 'image/jpeg')}
    response = requests.post(f"{BASE_URL}?type=image", files=files, timeout=10)
    
    print(f"   Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"   [OK] Success:")
        print(f"      {json.dumps(response.json(), indent=4)}")
    else:
        print(f"   [X] Error Response:")
        print(f"      {json.dumps(response.json(), indent=4)}")
except requests.exceptions.ConnectionError:
    print("   [X] Connection Refused: Is Uvicorn running on port 8000?")
except Exception as e:
    print(f"   [X] Request Failed: {e}")

print("-" * 40)

# ----------------------------------------
# Test 2: Video Prediction
# ----------------------------------------
print("\n2. Testing POST /api/v1/predict?type=video")
try:
    if os.path.exists(video_file):
        files = {'file': open(video_file, 'rb')}
        print(f"   (Using test video: {os.path.basename(video_file)})")
        response = requests.post(f"{BASE_URL}?type=video", files=files, timeout=30)
        
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            print(f"   [OK] Success:")
            print(f"      {json.dumps(response.json(), indent=4)}")
        else:
            print(f"   [X] Error Response:")
            print(f"      {json.dumps(response.json(), indent=4)}")
    else:
        print(f"   ⚠️ Test skipped: Could not find real video file at {video_file}")
except requests.exceptions.ConnectionError:
    print("   [X] Connection Refused: Is Uvicorn running on port 8000?")
except Exception as e:
    print(f"   [X] Request Failed: {e}")

print("\n========================================")
