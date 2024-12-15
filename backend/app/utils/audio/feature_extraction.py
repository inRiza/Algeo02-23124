# app/utils/audio/feature_extraction.py
import pretty_midi
import numpy as np
import warnings
from ..audio.window_processor import process_audio_window
from ..audio.tempo_normalizer import normalize_tempo

def extract_features(midi_file):
    """Extract ATB, RTB, and FTB features from MIDI file"""
    try:
        # Suppress warnings about MIDI format
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            midi_data = pretty_midi.PrettyMIDI(midi_file)
        
        # Get all non-drum tracks
        melody_notes = []
        for instrument in midi_data.instruments:
            if not instrument.is_drum:
                melody_notes.extend(instrument.notes)
        
        if not melody_notes:
            raise ValueError("No melody found in MIDI file")

        # Sort notes by start time
        melody_notes.sort(key=lambda x: x.start)
        
        # Extract pitches
        pitches = [note.pitch for note in melody_notes]
        
        # Normalize pitches
        normalized_pitches = normalize_tempo(pitches)
        
        # Calculate features
        features = {
            'atb': calculate_atb(normalized_pitches),
            'rtb': calculate_rtb(normalized_pitches),
            'ftb': calculate_ftb(normalized_pitches)
        }
        
        return features
        
    except Exception as e:
        print(f"Error processing MIDI file {midi_file}: {str(e)}")
        raise

def calculate_atb(pitches):
    """Calculate Absolute Tone Based histogram"""
    histogram = np.zeros(128)  # MIDI pitches range from 0-127
    for pitch in pitches:
        histogram[int(pitch)] += 1
    return normalize_histogram(histogram)

def calculate_rtb(pitches):
    """Calculate Relative Tone Based histogram"""
    histogram = np.zeros(255)  # Range from -127 to +127
    for i in range(1, len(pitches)):
        diff = int(pitches[i] - pitches[i-1])
        # Shift to positive index (diff ranges from -127 to 127)
        index = diff + 127  # Center at 127
        if 0 <= index < 255:  # Ensure within bounds
            histogram[index] += 1
    return normalize_histogram(histogram)

def calculate_ftb(pitches):
    """Calculate First Tone Based histogram"""
    if not pitches:
        return np.zeros(255)
    
    histogram = np.zeros(255)  # Range from -127 to +127
    first_pitch = pitches[0]
    for pitch in pitches[1:]:
        diff = int(pitch - first_pitch)
        # Shift to positive index
        index = diff + 127  # Center at 127
        if 0 <= index < 255:  # Ensure within bounds
            histogram[index] += 1
    return normalize_histogram(histogram)

def normalize_histogram(histogram):
    """
    Normalize histogram according to specification:
    Hnorm = H[d] / (127 Σ d H[d])
    """
    total = np.sum(histogram)
    if total > 0:
        return histogram / (127 * total)
    return histogram