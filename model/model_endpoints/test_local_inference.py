import requests
import json
import os

# Configuration
# Since we are running the test on the same PC as the Uvicorn server, we can use localhost
BASE_URL = "http://localhost:8000/api/v1/predict"

# You need to fetch an active API key from your local MySQL database for this to work
# For testing, we can temporarily bypass it or assume you have one.
# If your local DB has the same key, put it here:
API_KEY = "YOUR_API_KEY_HERE"  # Replace this with a key from your api_keys table!

HEADERS = {
    "x-api-key": API_KEY
}

# Dataset files
IMAGE_PATH = r"c:\Users\User\Music\SignLens\SignLens\model\dataset\image\A\A_Front_frame_000.jpg"
VIDEO_PATH = r"c:\Users\User\Music\SignLens\SignLens\model\dataset\video_raw\A\A_Front_sync_0.mp4"

def test_prediction(file_path, media_type):
    if not os.path.exists(file_path):
        print(f"❌ Error: File not found at {file_path}")
        return

    print(f"\n🚀 Testing file: {os.path.basename(file_path)}")
    
    # We must pass 'image' or 'video' to pass FastAPI's enum validation,
    # even though the backend will auto-detect the actual content anyway!
    params = {"type": media_type} 

    try:
        with open(file_path, "rb") as f:
            files = {"file": (os.path.basename(file_path), f, "application/octet-stream")}
            
            # Send the POST request
            response = requests.post(
                BASE_URL, 
                params=params, 
                headers=HEADERS, 
                files=files
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Prediction Success!")
                print(json.dumps(response.json(), indent=4))
            else:
                print("❌ Prediction Failed!")
                print(response.text)
                
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Is Uvicorn running on port 8000?")

if __name__ == "__main__":
    print("========================================")
    print("   SignLens Local Inference Tester      ")
    print("========================================")
    
    # 1. Test an Image
    test_prediction(IMAGE_PATH, "image")
    
    # 2. Test a Video
    test_prediction(VIDEO_PATH, "video")
