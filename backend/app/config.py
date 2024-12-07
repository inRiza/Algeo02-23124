import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORAGE_DIR = os.path.join(BASE_DIR, 'storage')
DATASET_DIR = os.path.join(STORAGE_DIR, 'dataset', 'images')
TEMP_DIR = os.path.join(STORAGE_DIR, 'temp')

# Create directories if they don't exist
for dir_path in [STORAGE_DIR, DATASET_DIR, TEMP_DIR]:
    os.makedirs(dir_path, exist_ok=True)
