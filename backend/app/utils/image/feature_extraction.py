# app/utils/image/feature_extraction.py
import numpy as np

def flatten_image(image_array):
    """Flatten a 2D grayscale image into a 1D vector."""
    return image_array.flatten()

def calculate_histogram(image_array):
    """Calculate the normalized histogram of grayscale intensities."""
    histogram, _ = np.histogram(image_array, bins=256, range=(0, 255))
    return histogram / np.sum(histogram)