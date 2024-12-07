from PIL import Image
import numpy as np

def convert_to_grayscale(image_path):
    """Convert an image to grayscale and return the array."""
    img = Image.open(image_path).convert('L')
    return np.array(img)

def resize_image(image_array, size=(100, 100)):
    """Resize the image to a specific size."""
    img = Image.fromarray(image_array)
    img_resized = img.resize(size)
    return np.array(img_resized)
