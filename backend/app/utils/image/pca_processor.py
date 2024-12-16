import numpy as np
from typing import Tuple, List

class PCAProcessor:
    def __init__(self, n_components: int = 50):
        print("Initializing PCAProcessor...")
        self.n_components = min(n_components, 50)
        self.mean_face = None
        self.components = None
        self.explained_variance = None
        print(f"PCAProcessor initialized with {self.n_components} components")

    def fit_transform(self, data_matrix: np.ndarray) -> np.ndarray:
        print("Starting PCA fit_transform...")
        print(f"Input data shape: {data_matrix.shape}")
        try:
            # 1. Center the data
            print("Computing mean face...")
            self.mean_face = np.mean(data_matrix, axis=0)
            print("Centering data...")
            centered_data = data_matrix - self.mean_face

            # 2. Compute SVD on centered data directly
            print("Computing SVD...")
            # Use smaller covariance matrix (N x N) instead of (D x D)
            C = centered_data @ centered_data.T  # Shape: (N x N)
            print(f"Small covariance matrix shape: {C.shape}")
            
            eigenvalues, eigenvectors = np.linalg.eigh(C)
            print("Eigendecomposition complete")

            # Sort eigenvalues and eigenvectors in descending order
            idx = np.argsort(eigenvalues)[::-1]
            eigenvalues = eigenvalues[idx]
            eigenvectors = eigenvectors[:, idx]

            # Get the actual principal components
            print("Computing principal components...")
            # Normalize the eigenvectors
            components = centered_data.T @ eigenvectors
            norms = np.sqrt(np.sum(components ** 2, axis=0))
            self.components = components / norms

            # Keep only n_components
            self.components = self.components[:, :self.n_components]
            self.explained_variance = eigenvalues[:self.n_components] / (data_matrix.shape[0] - 1)

            # Project the data
            print("Projecting data...")
            projected_data = centered_data @ self.components
            print(f"Projection complete. Shape: {projected_data.shape}")

            return projected_data

        except Exception as e:
            print(f"Error in PCA fit_transform: {str(e)}")
            raise

    def transform(self, query_image: np.ndarray) -> np.ndarray:
        """Transform new image into PCA space."""
        if query_image.ndim == 1:
            query_image = query_image.reshape(1, -1)
        centered_query = query_image - self.mean_face
        return centered_query @ self.components

    def compute_similarity(self, query_projection: np.ndarray, database_projections: np.ndarray) -> List[Tuple[int, float]]:
        """Compute similarity using Euclidean distance."""
        distances = []
        query_projection = query_projection.reshape(-1)
        
        for i, proj in enumerate(database_projections):
            proj = proj.reshape(-1)
            distance = np.sqrt(np.sum((query_projection - proj) ** 2))
            similarity = 100 * np.exp(-distance / (2 * self.n_components))
            distances.append((i, similarity))
        
        distances.sort(key=lambda x: x[1], reverse=True)
        return distances

    def cumulative_explained_variance_ratio(self) -> np.ndarray:
        """Get cumulative proportion of variance explained."""
        if self.explained_variance is None:
            return np.array([])
        total_var = np.sum(self.explained_variance)
        if total_var == 0:
            return np.ones_like(self.explained_variance)
        var_ratio = self.explained_variance / total_var
        return np.cumsum(var_ratio)