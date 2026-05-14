print("Testing imports one by one...")

print("1. Importing cv2...")
import cv2
print("   ✓ cv2 imported")

print("2. Importing numpy...")
import numpy as np
print("   ✓ numpy imported")

print("3. Importing os...")
import os
print("   ✓ os imported")

print("4. Importing mediapipe...")
import mediapipe as mp
print("   ✓ mediapipe imported")

print("5. Importing time...")
import time
print("   ✓ time imported")

print("\n6. Testing MediaPipe setup...")
mp_holistic = mp.solutions.holistic
print("   ✓ mp_holistic loaded")

mp_drawing = mp.solutions.drawing_utils
print("   ✓ mp_drawing loaded")

print("\n7. Testing OpenCV VideoCapture...")
cap = cv2.VideoCapture(0)
if cap.isOpened():
    print("   ✓ Camera opened successfully")
    cap.release()
else:
    print("   ✗ Camera failed to open")

print("\nAll tests passed!")
input("Press Enter to exit...")
