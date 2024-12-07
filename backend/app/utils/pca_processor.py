from sklearn.decomposition import PCA
import numpy as np

def apply_pca(data_matrix, n_components=50):
    """
    Apply PCA to reduce dimensions.
    Args:
        data_matrix: 2D array where each row is a flattened image.
        n_components: Number of PCA components to keep.
    """
    pca = PCA(n_components=n_components)
    transformed_data = pca.fit_transform(data_matrix)
    return pca, transformed_data
