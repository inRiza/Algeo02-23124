import os
import numpy as np
import time
from PIL import Image
from werkzeug.utils import secure_filename
from app.config import IMAGE_DATASET_DIR
from app.utils.image.pca_processor import PCAProcessor
import json

class ImageService:
    def __init__(self):
        print("Initializing ImageService...")
        self.dataset_features = []
        self.filenames = []
        self.pca_processor = PCAProcessor(n_components=2)  
        self.mapper = {}
        self.last_execution_time = 0
        print("About to load dataset...")
        self.load_dataset()
        print("About to load mapper...")
        self.load_mapper()
        print("ImageService initialization complete")

    def load_dataset(self):
        """Load and process all images in dataset"""
        print("Loading image dataset...")
        image_vectors = []
        self.filenames = []

        # Check if directory exists
        print(f"Checking directory: {IMAGE_DATASET_DIR}")
        if not os.path.exists(IMAGE_DATASET_DIR):
            os.makedirs(IMAGE_DATASET_DIR)
            print(f"Created dataset directory: {IMAGE_DATASET_DIR}")
            return

        print("Scanning directory for images...")
        files = os.listdir(IMAGE_DATASET_DIR)
        print(f"Found {len(files)} total files")
        
        for filename in files:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                print(f"Processing image: {filename}")
                try:
                    filepath = os.path.join(IMAGE_DATASET_DIR, filename)
                    # Convert to grayscale and resize
                    img = Image.open(filepath)
                    print(f"Original image size: {img.size}")
                    img = img.convert('L')
                    print("Converted to grayscale")
                    img = img.resize((100, 100))
                    print("Resized to 100x100")
                    # Convert to numpy array and flatten
                    img_array = np.array(img).flatten()
                    print(f"Flattened array shape: {img_array.shape}")
                    image_vectors.append(img_array)
                    self.filenames.append(filename)
                    print(f"Successfully processed {filename}")
                except Exception as e:
                    print(f"Error processing {filename}: {str(e)}")
                    continue

        if image_vectors:
            print(f"\nPreparing PCA for {len(image_vectors)} images...")
            # Convert to numpy array and apply PCA
            data_matrix = np.array(image_vectors)
            print(f"Data matrix shape: {data_matrix.shape}")
            print("Starting PCA transformation...")
            self.dataset_features = self.pca_processor.fit_transform(data_matrix)
            print(f"PCA transformation complete. Output shape: {self.dataset_features.shape}")
            
            # Calculate variance explained
            var_ratio = self.pca_processor.cumulative_explained_variance_ratio()
            print(f"Processed {len(self.filenames)} images with PCA")
            print(f"Cumulative variance explained: {var_ratio[-1]*100:.2f}%")
        else:
            print("No valid images found in dataset")

    def find_matches(self, file, top_n=5):
        """Find similar images for query image"""
        start_time = time.time()
        
        try:
            # Process query image
            img = Image.open(file).convert('L')
            img = img.resize((100, 100))
            query_vector = np.array(img).flatten()
            
            # Project query into PCA space
            query_projection = self.pca_processor.transform(query_vector)
            
            # Get similarity scores
            similarities = self.pca_processor.compute_similarity(
                query_projection, 
                self.dataset_features
            )
            
            # Filter and format matches
            matches = []
            for idx, similarity in similarities:
                if similarity >= 55.0:  # Only include matches above 55%
                    matches.append({
                        "filename": self.filenames[idx],
                        "similarity": similarity,
                        "audioFile": self.mapper.get(self.filenames[idx])
                    })
                if len(matches) >= top_n:
                    break
            
            self.last_execution_time = (time.time() - start_time) * 1000
            return matches

        except Exception as e:
            print(f"Error finding matches: {str(e)}")
            raise

    def save_dataset_image(self, file, filename):
        """Save uploaded image to dataset directory"""
        filepath = os.path.join(IMAGE_DATASET_DIR, secure_filename(filename))
        file.save(filepath)
        # Reload dataset after adding new image
        self.load_dataset()

    def get_dataset_files(self):
        """Get list of all images in dataset"""
        return [f for f in os.listdir(IMAGE_DATASET_DIR) 
                if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    def load_mapper(self):
        """Load image-to-audio mapping from file"""
        mapper_json = os.path.join(IMAGE_DATASET_DIR, 'mapper.json')
        mapper_txt = os.path.join(IMAGE_DATASET_DIR, 'mapper.txt')
        
        if os.path.exists(mapper_json):
            with open(mapper_json, 'r') as f:
                self.mapper = json.load(f)
        elif os.path.exists(mapper_txt):
            self.mapper = {}
            with open(mapper_txt, 'r') as f:
                lines = f.readlines()
                for line in lines[1:]:  # Skip header
                    parts = line.strip().split()
                    if len(parts) >= 2:
                        audio_file, pic_name = parts[:2]
                        self.mapper[pic_name] = audio_file

    def update_mapper(self, new_mapping):
        """Update image-to-audio mapping"""
        self.mapper = new_mapping
        # Save to both formats for compatibility
        mapper_json = os.path.join(IMAGE_DATASET_DIR, 'mapper.json')
        with open(mapper_json, 'w') as f:
            json.dump(self.mapper, f, indent=2)
            
        mapper_txt = os.path.join(IMAGE_DATASET_DIR, 'mapper.txt')
        with open(mapper_txt, 'w') as f:
            f.write("audio_file pic_name\n")
            for pic_name, audio_file in self.mapper.items():
                f.write(f"{audio_file} {pic_name}\n")

    def get_mapper(self):
        """Get current image-to-audio mapping"""
        return self.mapper