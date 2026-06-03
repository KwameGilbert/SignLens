# Video Model Generalization Improvements

As requested, I have created a completely separate branch of your video dataset and model that focuses on **generalization** by removing the noisy facial landmarks.

## What Changed
1. **New Folder**: Created `model/video_no_face/` containing the new `model_video_version_no_face` codebase.
2. **Feature Reduction**: Updated `extract_keypoints` to completely ignore `face_landmarks`. The input size for the model is now **258** instead of **1662**.
3. **Dynamic Architecture**: Updated the LSTM model to dynamically read the input shape (`X_train.shape[2]`) instead of hardcoding 1662, so it scales perfectly with your new dataset.
4. **Model Saving**: Added an explicit `model.save(model_path)` call at the end of the training script so the final trained model is always saved, just like your image model.

## How to Run the New Pipeline
Open your terminal and navigate to the new folder:
```bash
cd ~/Music/SignLens/SignLens/model/video_no_face/model_video_version_no_face
```

Then run the pipeline exactly as you did before:

### 1. Extract the New Keypoints
```bash
../../.venv/Scripts/python.exe extract_keypoints_from_videos.py
```
*(This will generate the new 258-feature `.npy` files into the `dataset_video_keypoints_no_face` folder).*

### 2. Augment the Data
```bash
../../.venv/Scripts/python.exe augment_keypoints.py
```
*(This will duplicate and alter the sequences to inflate your dataset).*

### 3. Train the Model
```bash
../../.venv/Scripts/python.exe train_model_video.py
```
*(This will train your LSTM model on the new, noise-free hand and pose data).*

### 4. Test in Real-Time
```bash
../../.venv/Scripts/python.exe run_model_video.py
```
*(You should see significantly more stable predictions!)*
