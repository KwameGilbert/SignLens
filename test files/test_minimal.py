import sys
print("Python version:", sys.version)
print("Starting imports...")

print("1. cv2...")
import cv2
print("   OK")

print("2. numpy...")
import numpy as np
print("   OK")

print("3. mediapipe...")
import mediapipe as mp
print("   OK")

print("4. mp.solutions.holistic...")
mp_holistic = mp.solutions.holistic
print("   OK")

print("5. mp.solutions.drawing_utils...")
mp_drawing = mp.solutions.drawing_utils
print("   OK")

print("\nAll imports successful!")
print("Testing Holistic initialization...")

try:
    with mp_holistic.Holistic() as holistic:
        print("Holistic context manager works!")
except Exception as e:
    print(f"Holistic failed: {e}")
    import traceback
    traceback.print_exc()

input("Press Enter to exit...")
