import pretty_midi
import numpy as np

def process_audio_window(midi_data, window_size=20, sliding_amount=4):
    """
    Split melody into segments using sliding window technique
    Args:
        midi_data: PrettyMIDI object
        window_size: size of window in beats (default 20 beats)
        sliding_amount: sliding window amount (default 4 beats)
    """
    total_time = midi_data.get_end_time()
    tempo = midi_data.estimate_tempo()
    
    # Convert beats to time
    seconds_per_beat = 60.0 / tempo
    window_time = window_size * seconds_per_beat
    slide_time = sliding_amount * seconds_per_beat
    
    windows = []
    start_time = 0
    
    while start_time + window_time <= total_time:
        window = {
            'start_time': start_time,
            'end_time': start_time + window_time
        }
        windows.append(window)
        start_time += slide_time
        
    return windows
