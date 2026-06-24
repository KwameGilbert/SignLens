import cv2
import asyncio
import websockets
import json
import numpy as np

API_URL = "ws://localhost:8000/api/v1/predict-stream"
API_KEY = "de4e5d334a7b869f873fbd2aa3c29a1eba600d2b0d5bc3f011e73f7e5f1e1e27"  # Change this to your generated API key

async def stream_camera(mode):
    # Connect to the WebSocket
    ws_url = f"{API_URL}?api_key={API_KEY}&type={mode}"
    print(f"Connecting to backend: {ws_url}")
    
    try:
        async with websockets.connect(ws_url) as websocket:
            print("✅ Connected to SignLens Backend!")
            
            # Open the webcam with DirectShow to fix the "black/dim screen" issue on Windows
            cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
            
            if not cap.isOpened():
                print("❌ Error: Could not open webcam.")
                return

            print("\nLive prediction started! Press 'q' in the video window to exit.")
            
            # Setup window to be top-most
            window_name = f"SignLens Live - Mode: {mode.upper()}"
            cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
            cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)
            
            current_prediction = "Waiting for buffer..."
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    print("❌ Error: Camera disconnected.")
                    break
                
                # Compress frame to reduce latency over WebSocket
                _, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
                frame_bytes = buffer.tobytes()
                
                # Send the raw frame bytes to the backend
                await websocket.send(frame_bytes)
                
                # Receive the result asynchronously
                try:
                    response_str = await asyncio.wait_for(websocket.recv(), timeout=0.1)
                    response = json.loads(response_str)
                    
                    if "prediction" in response:
                        pred = response["prediction"]
                        conf = response["confidence"]
                        current_prediction = f"Prediction: {pred} ({conf:.2f})"
                    elif "status" in response:
                        current_prediction = response["status"]
                    elif "error" in response:
                        current_prediction = f"Error: {response['error']}"
                        
                except asyncio.TimeoutError:
                    pass # It's okay, we're waiting for buffer to fill or backend is busy
                
                # Display the prediction on the screen
                cv2.putText(frame, current_prediction, (10, 40), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                
                cv2.imshow(window_name, frame)
                
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                    
            cap.release()
            cv2.destroyAllWindows()
            
    except ConnectionRefusedError:
        print("❌ Error: Could not connect to backend. Is the FastAPI server running?")
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"❌ Connection failed: Status code {e.status_code}")
        if e.status_code == 403:
            print("Hint: Check your API_KEY.")
            
def main():
    print("="*50)
    print("SignLens Live Camera Tester")
    print("="*50)
    print("Select a mode to use:")
    print("1. 'video'  (Uses No-Face model - 258 features - highly recommended)")
    print("2. 'stream' (Uses Original model - 1662 features)")
    
    choice = input("Enter 1 or 2: ").strip()
    
    if choice == '1':
        mode = "video"
    elif choice == '2':
        mode = "stream"
    else:
        print("Invalid choice. Exiting.")
        return
        
    asyncio.run(stream_camera(mode))

if __name__ == "__main__":
    main()
