const API_BASE_URL = 'http://localhost:5000/api';

export interface AudioMatch {
  filename: string;
  similarity: number;
}

export interface ImageMatch {
  filename: string;
  similarity: number;
}

export const audioApi = {
  async uploadQuery(file: File): Promise<{matches: AudioMatch[], executionTime: number}> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/audio/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload query');
    }
    return response.json();
  },

  async uploadDataset(files: FileList): Promise<string[]> {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files[]', file);
    });
    const response = await fetch(`${API_BASE_URL}/audio/dataset`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload dataset');
    }
    const result = await response.json();
    return result.files;
  },

  async getDataset(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/audio/dataset`);
    if (!response.ok) {
      throw new Error('Failed to fetch dataset');
    }
    return response.json();
  }
};

export const imageApi = {
  async uploadQuery(file: File): Promise<{matches: ImageMatch[], executionTime: number}> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload query');
    }
    return response.json();
  },

  async uploadDataset(files: FileList): Promise<string[]> {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files[]', file);
    });
    const response = await fetch(`${API_BASE_URL}/image/dataset`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload dataset');
    }
    const result = await response.json();
    return result.files;
  },

  async getDataset(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/image/dataset`);
    if (!response.ok) {
      throw new Error('Failed to fetch dataset');
    }
    return response.json();
  },

  async uploadMapper(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/image/mapper`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload mapper');
    }
  },

  async getMapper(): Promise<Record<string, string>> {
    const response = await fetch(`${API_BASE_URL}/image/mapper`);
    if (!response.ok) {
      throw new Error('Failed to fetch mapper');
    }
    return response.json();
  }
};