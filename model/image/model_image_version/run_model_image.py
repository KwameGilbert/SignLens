import os
import numpy as np
import cv2
from tensorflow.keras.models import load_model

IMG_SIZE = (128, 128)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'best_sign_language_model_image.h5')
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'dataset_images')

# Get class labels
classes = [d for d in os.listdir(DATA_PATH) if os.path.isdir(os.path.join(DATA_PATH, d))]
classes.sort()

model = load_model(MODEL_PATH)

cap = cv2.VideoCapture(0)
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    img = cv2.resize(frame, IMG_SIZE)
    img = img.astype('float32') / 255.0
    input_data = np.expand_dims(img, axis=0)
    preds = model.predict(input_data)
    pred_class = np.argmax(preds)
    confidence = np.max(preds)
    label = classes[pred_class]
    # Print detected sign and confidence in terminal
    print(f"Detected sign: {label} (confidence: {confidence:.2f})")
    cv2.putText(frame, f"{label} ({confidence:.2f})", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2, cv2.LINE_AA)
    cv2.imshow('SignLens Image Model', frame)
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()
