# SignLens Model Optimizations & Architecture Evolution

This document details the architectural choices and technical optimizations implemented in the SignLens project, evolving it from a basic prototype to a "Researcher Grade" Deep Learning system.

## 1. Core Architecture: LSTM vs. Classical ML

**Change**: Replaced `scikit-learn` (SVM/Random Forest) with **TensorFlow/Keras LSTM**.

| Feature                                 | Reason                                                                                                   | Advantage                                                                                                                                                 |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LSTM (Long Short-Term Memory)** | Sign language is**temporal**. The meaning depends on movement over time, not just static position. | **Captures Dynamics**: Can distinguish between a hand moving *left-to-right* vs. *right-to-left*, which classical models cannot do effectively. |
| **Sequence Data (30 Frames)**     | A single frame is ambiguous. A 30-frame sequence captures the full gesture context.                      | **Contextual Awareness**: The model sees the "movie" instead of just a "photo".                                                                     |

## 2. Training Stability & Speed

### Batch Normalization

* **What**: Normalizes layer inputs (mean=0, var=1) inside the network.
* **Reason**: Deep networks suffer from "Internal Covariate Shift," where layers keep chasing moving targets.
* **Advantage**: **Faster Convergence**. The model learns 2-3x faster and is less sensitive to bad initial weights.

### Adam Optimizer vs. SGD

* **What**: Adaptive Moment Estimation optimizer.
* **Reason**: SGD uses a fixed learning rate for all parameters. LSTMs have complex error surfaces.
* **Advantage**: **Smart Learning**. Adam adjusts the speed for *each* weight individually, avoiding "saddle points" where SGD often gets stuck.

## 3. Regularization (Preventing Overfitting)

### Dropout (20%)

* **What**: Randomly turns off 20% of neurons during training.
* **Reason**: Prevents the model from "memorizing" specific data paths.
* **Advantage**: **Robustness**. Forces the brain to learn redundant, resilient features.

### Label Smoothing (0.1)

* **What**: Tells the model to aim for 90% confidence instead of 100%.
* **Reason**: Targeting 100% makes the model "arrogant" and prone to overfitting on noise.
* **Advantage**: **Better Generalization**. The model becomes more adaptable to new, unseen users.

## 4. Data Strategy

### Data Augmentation (Jitter & Scaling)

* **What**: Artificially creates noisy (jittered) and zoomed (scaled) copies of training data.
* **Reason**: You cannot record every possible variation yourself.
* **Advantage**: **Triples Dataset Size**. Makes the model robust to camera distance (scale) and shaky hands (jitter).

### .npy (NumPy) Format

* **What**: Storing data as binary NumPy arrays instead of CSV/JSON.
* **Reason**: Text formats are slow and lose shape information.
* **Advantage**: **Performance**. Lightning-fast loading and perfect preservation of 3D array shapes `(Sequence, Frame, Keypoints)`.

## 5. Training Intelligence (Callbacks)

### EarlyStopping

* **What**: Stops training when the validation loss stops improving.
* **Reason**: Training too long leads to overfitting (memorizing).
* **Advantage**: **Efficiency**. Automatically finds the "perfect" stopping point without human guessing.

### ModelCheckpoint

* **What**: Saves the model *only* when it achieves a new personal best score.
* **Reason**: The final epoch isn't always the best epoch.
* **Advantage**: **Safety**. Ensures we always keep the single best version of the "brain".

### ReduceLROnPlateau

* **What**: Lowers the learning rate when progress stalls.
* **Reason**: Like threading a needle—you need to move slower as you get closer to the target.
* **Advantage**: **Precision**. Allows the model to fine-tune itself into a deeper, more accurate minimum.

## 6. Evaluation

### Confusion Matrix

* **What**: A visualization showing *exactly* which signs are confused with each other.
* **Reason**: "Accuracy: 90%" doesn't tell you *what* is wrong.
* **Advantage**: **Actionable Insights**. Allows you to fix specific weak points (e.g., "It confuses 'A' with 'E', so I need to record more 'E's").
