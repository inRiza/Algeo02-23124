from app.utils.grayscale_resizer import convert_to_grayscale, resize_image
from app.utils.feature_extraction import flatten_image, calculate_histogram
from app.utils.pca_processor import apply_pca
from app.config import IMAGE_DATASET_DIR
import numpy as np
import os

class ImageService:
    def __init__(self):
        self.dataset_features = []
        self.pca = None
        self._load_dataset()

    def _load_dataset(self):
        """Load and process images in the dataset."""
        image_vectors = []

        for filename in os.listdir(IMAGE_DATASET_DIR):
            if filename.endswith(('.png', '.jpg', '.jpeg')):
                filepath = os.path.join(IMAGE_DATASET_DIR, filename)
                img_gray = convert_to_grayscale(filepath)
                img_resized = resize_image(img_gray)
                img_flattened = flatten_image(img_resized)
                image_vectors.append(img_flattened)

        # Apply PCA to the dataset
        data_matrix = np.array(image_vectors)
        self.pca, self.dataset_features = apply_pca(data_matrix)

    def find_matches(self, query_path, top_n=5):
        """Find similar images for a query."""
        query_gray = convert_to_grayscale(query_path)
        query_resized = resize_image(query_gray)
        query_flattened = flatten_image(query_resized)

        # Project query into PCA space
        query_pca = self.pca.transform([query_flattened])

        # Calculate distances to all dataset images
        distances = []
        for i, feature_vector in enumerate(self.dataset_features):
            distance = np.linalg.norm(query_pca - feature_vector)
            distances.append((i, distance))

        # Sort by smallest distance
        distances.sort(key=lambda x: x[1])

        # Retrieve top N results
        return [{"index": i, "distance": dist} for i, dist in distances[:top_n]]
