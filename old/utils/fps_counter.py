import time

class FPSCounter:
    def __init__(self):
        self.prev_time = 0
        self.curr_time = 0
        self.fps = 0

    def update(self):
        self.curr_time = time.time()
        diff = self.curr_time - self.prev_time
        if diff > 0:
            self.fps = 1.0 / diff
        self.prev_time = self.curr_time

    def get_fps(self):
        return int(self.fps)