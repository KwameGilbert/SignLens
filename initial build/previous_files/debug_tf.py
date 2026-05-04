import tensorflow
import os

print(f"TensorFlow imported from: {tensorflow.__file__}")
print(f"Directory listing of {os.getcwd()}:")
print(os.listdir(os.getcwd()))
