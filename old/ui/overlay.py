import cv2


class UIOverlay:
    def __init__(self, config):
        self.config = config
        self.show_fps = config['ui'].get('show_fps', True)
        self.show_status = config['ui'].get('show_status', True)
        self.show_prediction = config['ui'].get('show_prediction', False)

    def draw_fps(self, image, fps):
        if self.show_fps:
            cv2.putText(image, f'FPS: {fps}',
                        (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.8, (0, 255, 0), 2)

    def draw_status(self, image, text, color=(255, 255, 255)):
        if self.show_status:
            cv2.putText(image, text,
                        (10, 70),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.8, color, 2)

    def draw_prediction(self, image, label, probability):
        if self.show_prediction:
            cv2.putText(
                image,
                f'{label} ({probability:.2f})',
                (10, 110),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 200, 255),
                2
            )
