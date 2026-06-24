from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
from tensorflow.keras.losses import CategoricalCrossentropy

def get_keypoint_model(input_shape, num_classes):
    model = Sequential()
    model.add(LSTM(64, return_sequences=True, activation='tanh', input_shape=input_shape))
    model.add(BatchNormalization())
    model.add(Dropout(0.2))
    model.add(LSTM(128, return_sequences=True, activation='tanh'))
    model.add(BatchNormalization())
    model.add(Dropout(0.2))
    model.add(LSTM(64, return_sequences=False, activation='tanh'))
    model.add(BatchNormalization())
    model.add(Dropout(0.2))
    model.add(Dense(64, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dense(32, activation='relu'))
    model.add(BatchNormalization())
    model.add(Dense(num_classes, activation='softmax'))
    loss = CategoricalCrossentropy(label_smoothing=0.1)
    model.compile(optimizer='Adam', loss=loss, metrics=['categorical_accuracy'])
    return model
