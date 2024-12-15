# app/utils/file_handler.py
import os
from werkzeug.utils import secure_filename
from app.config import AUDIO_DATASET_DIR  # Changed from DATASET_FOLDER

ALLOWED_EXTENSIONS = {'mid', 'midi'}  # Define this here or in config

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_dataset_file(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(AUDIO_DATASET_DIR, filename)
        file.save(filepath)
        return filepath
    return None