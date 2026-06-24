from tensorflow.keras.models import Model, load_model
from tensorflow.keras.layers import Input, Dense, Dropout, BatchNormalization, Concatenate, Flatten
from tensorflow.keras.losses import CategoricalCrossentropy

# Assumes you have trained and saved models for each modality
# and that you know the input shapes and number of classes

def get_fusion_model(image_model_path, video_model_path, keypoint_model_path, num_classes):
    # Load pre-trained models (without top classification layer)
    image_model = load_model(image_model_path)
    video_model = load_model(video_model_path)
    keypoint_model = load_model(keypoint_model_path)

    # Remove last layer (softmax) to get feature outputs
    image_feature = image_model.layers[-3].output  # Dense(128, relu) or similar
    video_feature = video_model.layers[-3].output  # Dense(32, relu) or similar
    keypoint_feature = keypoint_model.layers[-3].output  # Dense(32, relu) or similar

    # Concatenate features
    fusion = Concatenate()([Flatten()(image_feature), Flatten()(video_feature), Flatten()(keypoint_feature)])
    fusion = Dense(128, activation='relu')(fusion)
    fusion = BatchNormalization()(fusion)
    fusion = Dropout(0.5)(fusion)
    output = Dense(num_classes, activation='softmax')(fusion)

    # Build new model with three inputs
    fusion_model = Model(inputs=[image_model.input, video_model.input, keypoint_model.input], outputs=output)
    loss = CategoricalCrossentropy(label_smoothing=0.1)
    fusion_model.compile(optimizer='adam', loss=loss, metrics=['categorical_accuracy'])
    return fusion_model
