from app.utils.audio.feature_extraction import extract_features
from app.config import AUDIO_DATASET_DIR, AUDIO_TEMP_DIR
import numpy as np
import os
import time

class AudioService:
    def __init__(self):
        self.dataset_features = {}
        self.last_execution_time = 0
        self._load_dataset()
    
    def _load_dataset(self):
        """Load dan extract features dari semua file MIDI di dataset"""
        print("Loading dataset...")
        for filename in os.listdir(AUDIO_DATASET_DIR):
            if filename.endswith(('.mid', '.midi')):
                filepath = os.path.join(AUDIO_DATASET_DIR, filename)
                try:
                    features = extract_features(filepath)
                    self.dataset_features[filename] = features
                    print(f"Successfully loaded {filename}")
                except Exception as e:
                    print(f"Error loading {filename}: {str(e)}")
    
    def find_matches(self, query_path, top_n=1):  # Ubah default top_n menjadi 1
        """Find matches untuk query MIDI file"""
        start_time = time.time()
        matches = []
        try:
            print(f"Processing query file: {query_path}")
            query_features = extract_features(query_path)
            print("Calculating similarities...")

            for filename, features in self.dataset_features.items():
                try:
                    similarity = self._calculate_similarity(query_features, features)
                    print(f"Similarity with {filename}: {similarity}")
                    matches.append({
                        'filename': filename,
                        'similarity': float(similarity * 100)
                    })
                except Exception as e:
                    print(f"Error calculating similarity for {filename}: {str(e)}")
                    continue

            # Sort matches by similarity in descending order and take only top_n
            matches.sort(key=lambda x: x['similarity'], reverse=True)
            matches = matches[:top_n]  # Ambil hanya top_n matches

            self.last_execution_time = (time.time() - start_time) * 1000
            print(f"Found {len(matches)} matches")
            return matches
        except Exception as e:
            print("error cok")

    def _calculate_similarity(self, features1, features2):
        """Calculate similarity between two feature sets using cosine similarity"""
        try:
            # Calculate similarities for each feature type
            atb_sim = self._cosine_similarity(features1['atb'], features2['atb'])
            rtb_sim = self._cosine_similarity(features1['rtb'], features2['rtb'])
            ftb_sim = self._cosine_similarity(features1['ftb'], features2['ftb'])
            
            # Weighted combination (can be adjusted)
            weights = [0.4, 0.3, 0.3]  # ATB, RTB, FTB weights
            similarity = (weights[0] * atb_sim + 
                        weights[1] * rtb_sim + 
                        weights[2] * ftb_sim)
            
            return similarity
            
        except Exception as e:
            print(f"Error in _calculate_similarity: {str(e)}")
            return 0.0
    
    @staticmethod
    def _cosine_similarity(v1, v2):
        """Calculate cosine similarity between two vectors"""
        dot_product = np.dot(v1, v2)
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        return dot_product / (norm1 * norm2) if norm1 * norm2 != 0 else 0