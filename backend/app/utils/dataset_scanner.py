import os
from ..config import DATASET_DIR

def scan_midi_files():
    """Scan semua file MIDI dalam dataset folder"""
    midi_files = []
    for root, _, files in os.walk(DATASET_DIR):
        for file in files:
            if file.endswith(('.mid', '.midi')):
                midi_files.append(os.path.join(root, file))
    return midi_files

def get_dataset_info():
    """Get informasi tentang dataset"""
    midi_files = scan_midi_files()
    return {
        'total_files': len(midi_files),
        'files': [os.path.basename(f) for f in midi_files]
    }