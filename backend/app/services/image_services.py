from app.utils.image.grayscale_resizer import convert_to_grayscale, resize_image
from app.utils.image.feature_extraction import flatten_image
from app.utils.image.pca_processor import apply_pca
from app.config import IMAGE_DATASET_DIR
import numpy as np
import os

class ImageService:
    def __init__(self):
        self.dataset_features = []
        self.pca = None
        self.filenames = []
        self._load_dataset()

    def _load_dataset(self):
        """Load and process images in the dataset."""
        print("Loading image dataset...")
        image_vectors = []
        self.filenames = []

        # Check if directory exists
        if not os.path.exists(IMAGE_DATASET_DIR):
            print(f"Dataset directory {IMAGE_DATASET_DIR} does not exist")
            return

        # Get valid image files
        valid_files = [f for f in os.listdir(IMAGE_DATASET_DIR) 
                      if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

        if not valid_files:
            print("No valid images found in dataset")
            return

        for filename in valid_files:
            try:
                filepath = os.path.join(IMAGE_DATASET_DIR, filename)
                img_gray = convert_to_grayscale(filepath)
                img_resized = resize_image(img_gray)
                img_flattened = flatten_image(img_resized)
                image_vectors.append(img_flattened)
                self.filenames.append(filename)
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")
                continue

        # Only apply PCA if we have images
        if image_vectors:
            print(f"Processing {len(image_vectors)} images with PCA...")
            data_matrix = np.array(image_vectors)
            self.pca, self.dataset_features = apply_pca(data_matrix)
            print("PCA processing complete")
        else:
            print("No images were successfully processed")

    def find_matches(self, query_path, top_n=5):
        """Find similar images for a query."""
        if not self.pca or not self.dataset_features.size:
            return []

        try:
            # Process query image
            query_gray = convert_to_grayscale(query_path)
            query_resized = resize_image(query_gray)
            query_flattened = flatten_image(query_resized)

            # Project query into PCA space
            query_pca = self.pca.transform([query_flattened])

            # Calculate distances to all dataset images
            distances = []
            for i, feature_vector in enumerate(self.dataset_features):
                distance = np.linalg.norm(query_pca - feature_vector)
                distances.append({
                    "index": i,
                    "distance": float(distance),
                    "filename": self.filenames[i]
                })

            # Sort by smallest distance
            distances.sort(key=lambda x: x["distance"])
            
            return distances[:top_n]
        except Exception as e:
            print(f"Error finding matches: {str(e)}")
            return []