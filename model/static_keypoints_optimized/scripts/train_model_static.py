import os
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import TensorBoard, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.utils import to_categorical

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'dataset', 'static_keypoints_optimized')
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), '..', 'saved_models', 'sign_language_model_static.h5')

# Standard alphabet + Neutral
CLASSES = [chr(i) for i in range(ord('A'), ord('Z')+1)] + ['Neutral']
EPOCHS = 100

def load_data():
    X, y = [], []
    for label_idx, class_name in enumerate(CLASSES):
        class_path = os.path.join(DATA_PATH, class_name)
        if not os.path.exists(class_path):
            continue
            
        files = os.listdir(class_path)
        for file in files:
            if file.endswith('.npy'):
                res = np.load(os.path.join(class_path, file))
                X.append(res)
                y.append(label_idx)
                
    return np.array(X), np.array(y)

def main():
    print("Loading data...")
    X, y = load_data()
    
    if len(X) == 0:
        print("No data found! Please run extract_keypoints.py first.")
        return
        
    print(f"Loaded {len(X)} samples.")
    
    y = to_categorical(y).astype(int)
    
    # Shuffle and split data using numpy instead of sklearn
    indices = np.arange(len(X))
    np.random.shuffle(indices)
    X = X[indices]
    y = y[indices]
    
    split_idx = int(len(X) * 0.9)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]
    
    model = Sequential([
        Dense(128, activation='relu', input_shape=(258,)),
        Dropout(0.2),
        Dense(64, activation='relu'),
        Dropout(0.2),
        Dense(len(CLASSES), activation='softmax')
    ])
    
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['categorical_accuracy'])
    
    log_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'Logs', 'StaticOptimized')
    tb_callback = TensorBoard(log_dir=log_dir)
    early_stopping = EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True)
    lr_scheduler = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6, verbose=1)
    
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    
    print("Training model...")
    model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=EPOCHS,
        callbacks=[tb_callback, early_stopping, lr_scheduler]
    )
    
    model.save(MODEL_SAVE_PATH)
    print(f"Model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    main()
