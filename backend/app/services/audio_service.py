from app.utils.audio.feature_extraction import extract_features
from app.config import AUDIO_DATASET_DIR, AUDIO_TEMP_DIR
import numpy as np
import os
import time
import warnings
import pretty_midi

class AudioService:
    def __init__(self):
        self.dataset_features = {}
        self.last_execution_time = 0
        self.similarity_threshold = 0.55  # 55% minimum threshold
        self._load_dataset()
    
    def _load_dataset(self):
        """Load dan extract features dari semua file MIDI di dataset"""
        print("Loading dataset...")
        for filename in os.listdir(AUDIO_DATASET_DIR):
            if filename.endswith(('.mid', '.midi')):
                filepath = os.path.join(AUDIO_DATASET_DIR, filename)
                try:
                    features = self._extract_features(filepath)
                    self.dataset_features[filename] = features
                    print(f"Successfully loaded {filename}")
                except Exception as e:
                    print(f"Error loading {filename}: {str(e)}")

    def _extract_features(self, midi_file):
        """Extract ATB, RTB, and FTB features from MIDI file"""
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                midi_data = pretty_midi.PrettyMIDI(midi_file)
            
            # Get all non-drum tracks
            melody_notes = []
            for instrument in midi_data.instruments:
                if not instrument.is_drum:
                    melody_notes.extend([
                        {
                            'pitch': note.pitch,
                            'duration': note.end - note.start,
                            'velocity': note.velocity,
                            'start': note.start
                        } 
                        for note in instrument.notes
                    ])
            
            if not melody_notes:
                raise ValueError("No melody found in MIDI file")
            
            # Sort notes by start time
            melody_notes.sort(key=lambda x: x['start'])
            
            # Extract and normalize features
            atb = self._normalize_histogram(self._calculate_atb(melody_notes))
            rtb = self._normalize_histogram(self._calculate_rtb(melody_notes))
            ftb = self._normalize_histogram(self._calculate_ftb(melody_notes))
            
            return {'atb': atb, 'rtb': rtb, 'ftb': ftb}
            
        except Exception as e:
            print(f"Error processing MIDI file {midi_file}: {str(e)}")
            raise

    def _calculate_atb(self, notes):
        """Calculate Absolute Tone Based histogram"""
        histogram = np.zeros(128)
        if not notes:
            return histogram
            
        total_duration = sum(note['duration'] for note in notes)
        if total_duration == 0:
            return histogram
            
        for note in notes:
            weight = (note['duration'] / total_duration) * (note['velocity'] / 127)
            histogram[note['pitch']] += weight
            
        return histogram

    def _calculate_rtb(self, notes):
        """Calculate Relative Tone Based histogram"""
        histogram = np.zeros(255)
        if len(notes) < 2:
            return histogram
            
        for i in range(1, len(notes)):
            prev_note, curr_note = notes[i-1], notes[i]
            diff = curr_note['pitch'] - prev_note['pitch']
            
            # Weight calculation
            avg_duration = (curr_note['duration'] + prev_note['duration']) / 2
            avg_velocity = (curr_note['velocity'] + prev_note['velocity']) / (2 * 127)
            weight = avg_duration * avg_velocity
            
            # Add to histogram with bounds checking
            index = diff + 127
            if 0 <= index < 255:
                histogram[index] += weight
                
        return histogram

    def _calculate_ftb(self, notes):
        """Calculate First Tone Based histogram"""
        histogram = np.zeros(255)
        if len(notes) < 2:
            return histogram
            
        first_note = notes[0]
        first_weight = first_note['duration'] * first_note['velocity']
        
        for note in notes[1:]:
            diff = note['pitch'] - first_note['pitch']
            weight = (note['duration'] * note['velocity']) / first_weight
            
            index = diff + 127
            if 0 <= index < 255:
                histogram[index] += weight
                
        return histogram

    def _normalize_histogram(self, histogram):
        """Normalize histogram according to specification"""
        sum_h = np.sum(histogram)
        if sum_h > 0:
            return histogram / (127 * sum_h)
        return histogram

    def _calculate_similarity(self, features1, features2):
        """Calculate similarity between two feature sets"""
        try:
            # Calculate basic similarities
            atb_sim = self._cosine_similarity(features1['atb'], features2['atb'])
            rtb_sim = self._cosine_similarity(features1['rtb'], features2['rtb'])
            ftb_sim = self._cosine_similarity(features1['ftb'], features2['ftb'])
            
            # Apply more lenient thresholds
            if atb_sim < 0.3 or rtb_sim < 0.2 or ftb_sim < 0.2:
                return 0.0
            
            # Calculate weighted similarity
            similarity = (0.4 * atb_sim + 0.3 * rtb_sim + 0.3 * ftb_sim)
            
            # Apply threshold and scaling
            if similarity < self.similarity_threshold:
                return 0.0
                
            # Scale to percentage
            scaled = ((similarity - self.similarity_threshold) / 
                     (1 - self.similarity_threshold)) * 100
                     
            return round(min(scaled, 100.0), 2)
            
        except Exception as e:
            print(f"Error in similarity calculation: {str(e)}")
            return 0.0

    def _cosine_similarity(self, v1, v2):
        """Calculate cosine similarity between two vectors"""
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
            
        dot_product = np.dot(v1, v2)
        return max(0.0, min(1.0, dot_product / (norm1 * norm2)))

    def find_matches(self, query_path, top_n=1):
        """Find matches untuk query MIDI file"""
        start_time = time.time()
        try:
            query_features = self._extract_features(query_path)
            matches = []
            
            for filename, features in self.dataset_features.items():
                similarity = self._calculate_similarity(query_features, features)
                # Hanya tambahkan jika di atas threshold 55%
                if similarity >= 55.0:  # Explicit threshold check
                    matches.append({
                        'filename': filename,
                        'similarity': similarity
                    })
            
            matches.sort(key=lambda x: x['similarity'], reverse=True)
            matches = matches[:top_n]
            
            self.last_execution_time = (time.time() - start_time) * 1000
            
            # Jika tidak ada matches yang memenuhi threshold, return list kosong
            return matches if matches else []
            
        except Exception as e:
            print(f"Error finding matches: {str(e)}")
            return []