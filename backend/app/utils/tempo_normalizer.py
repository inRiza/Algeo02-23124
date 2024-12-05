import numpy as np

def normalize_tempo(pitch_sequence):
    """
    Normalize tempo as specified in requirements
    NP(note) = (note - μ) / σ
    """
    if not pitch_sequence:
        return []
    
    mean = np.mean(pitch_sequence)
    std = np.std(pitch_sequence)
    
    if std == 0:  # Avoid division by zero
        return [0] * len(pitch_sequence)
        
    return [(note - mean) / std for note in pitch_sequence]