const API_BASE_URL = 'http://localhost:5000';

export interface AudioMatch {
    filename: string;
    similarity: number;
}

export const audioApi = {
    async uploadQuery(file: File): Promise<{matches: AudioMatch[], executionTime: number}> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/upload`, {
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

        const response = await fetch(`${API_BASE_URL}/dataset`, {
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
        const response = await fetch(`${API_BASE_URL}/dataset`);
        if (!response.ok) {
            throw new Error('Failed to fetch dataset');
        }
        return response.json();
    }
};