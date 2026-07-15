import requests
import json
import os

BASE_URL = "http://127.0.0.1:8000/api/v1/predict"
VIDEO_PATH = r"C:\Users\User\Pictures\Camera Roll\WIN_20260715_13_55_33_Pro.mp4"

def test_prediction():
    if not os.path.exists(VIDEO_PATH):
        print(f"Error: Video file not found at {VIDEO_PATH}")
        return

    print(f"Sending video: {os.path.basename(VIDEO_PATH)}")
    try:
        with open(VIDEO_PATH, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{BASE_URL}?type=video", files=files, timeout=60)
            
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print("Prediction Result:")
                print(json.dumps(response.json(), indent=4))
            else:
                print("Error Response:")
                print(json.dumps(response.json(), indent=4))
    except requests.exceptions.ConnectionError:
        print("Connection Refused: Is the FastAPI backend running on port 8000?")
    except Exception as e:
        print(f"Request Failed: {e}")

if __name__ == "__main__":
    test_prediction()
