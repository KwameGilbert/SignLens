import sys
import requests
import argparse

API_URL = "http://localhost:8000/api/v1/predict"
API_KEY = "de4e5d334a7b869f873fbd2aa3c29a1eba600d2b0d5bc3f011e73f7e5f1e1e27"  # Change this to your generated API key

def test_image(image_path):
    print(f"Testing image: {image_path}")
    
    try:
        with open(image_path, "rb") as f:
            files = {"file": (image_path, f, "image/jpeg")}
            params = {
                "type": "image"
            }
            headers = {
                "x-api-key": API_KEY
            }
            
            response = requests.post(API_URL, params=params, headers=headers, files=files)
            
            if response.status_code == 200:
                result = response.json()
                print("\n✅ Prediction Success!")
                print(f"Prediction: {result['prediction']}")
                print(f"Confidence: {result['confidence']:.2f}")
            else:
                print(f"\n❌ Request Failed (Status {response.status_code}):")
                print(response.text)
                
    except FileNotFoundError:
        print(f"Error: Could not find image file at {image_path}")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to backend. Is the FastAPI server running?")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test the SignLens Image Prediction Endpoint")
    parser.add_argument("image_path", help="Path to the image file to test")
    args = parser.parse_args()
    
    test_image(args.image_path)
