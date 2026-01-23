"""
Keypoint extraction for SignLens
Extracts face, pose, and hand landmarks from MediaPipe Holistic results.

Keypoint Order: [pose, face, left_hand, right_hand]
Total: 33*4 + 468*3 + 21*3 + 21*3 = 132 + 1404 + 63 + 63 = 1662
"""
import numpy as np


def extract_keypoints(results):
    """
    Extract and flatten keypoints from MediaPipe Holistic results.
    
    Args:
        results: MediaPipe Holistic detection results
        
    Returns:
        numpy array of shape (1662,) containing all keypoints
        
    Keypoint breakdown:
        - Pose: 33 landmarks × 4 (x, y, z, visibility) = 132
        - Face: 468 landmarks × 3 (x, y, z) = 1404
        - Left Hand: 21 landmarks × 3 (x, y, z) = 63
        - Right Hand: 21 landmarks × 3 (x, y, z) = 63
    """
    # Pose keypoints (33 landmarks × 4 values each)
    pose = np.array([[res.x, res.y, res.z, res.visibility] 
                     for res in results.pose_landmarks.landmark]).flatten() \
        if results.pose_landmarks else np.zeros(33 * 4)
    
    # Face keypoints (468 landmarks × 3 values each)
    face = np.array([[res.x, res.y, res.z] 
                     for res in results.face_landmarks.landmark]).flatten() \
        if results.face_landmarks else np.zeros(468 * 3)

    # Left hand keypoints (21 landmarks × 3 values each)
    lh = np.array([[res.x, res.y, res.z] 
                   for res in results.left_hand_landmarks.landmark]).flatten() \
        if results.left_hand_landmarks else np.zeros(21 * 3)

    # Right hand keypoints (21 landmarks × 3 values each)
    rh = np.array([[res.x, res.y, res.z] 
                   for res in results.right_hand_landmarks.landmark]).flatten() \
        if results.right_hand_landmarks else np.zeros(21 * 3)

    # IMPORTANT: Order must be [pose, face, lh, rh] to match standalone scripts
    return np.concatenate([pose, face, lh, rh])