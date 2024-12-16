export interface AudioMatch {
  filename: string;
  similarity: number;
}

export interface ImageMatch {
  filename: string;
  similarity: number;
  audioFile?: string;
}

export interface ImageFile {
  filename: string;
  audioFile?: string;
}

export interface QueryResponse {
  matches: ImageMatch[];
  executionTime: number;
}

export interface AlbumItem {
  filename: string;
  similarity?: number;
  audioFile?: string;
}