import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORAGE_DIR = os.path.join(BASE_DIR, 'storage')

# Audio directories
AUDIO_DATASET_DIR = os.path.join(STORAGE_DIR, 'dataset', 'midi')
AUDIO_TEMP_DIR = os.path.join(STORAGE_DIR, 'temp', 'audio')

# Image directories
IMAGE_DATASET_DIR = os.path.join(STORAGE_DIR, 'dataset', 'images')
IMAGE_TEMP_DIR = os.path.join(STORAGE_DIR, 'temp', 'images')

# Create all required directories
for dir_path in [
    STORAGE_DIR, 
    AUDIO_DATASET_DIR, 
    AUDIO_TEMP_DIR,
    IMAGE_DATASET_DIR, 
    IMAGE_TEMP_DIR
]:
    os.makedirs(dir_path, exist_ok=True)