// app/lib/types.ts
export interface QueryMatch {
    filename: string;
    similarity: number;
  }
  
  export interface QueryResponse {
    matches: QueryMatch[];
    executionTime: number;
  }