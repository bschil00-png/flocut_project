// ai.types.ts
export interface AIPreviewRequest {
  type: 'document' | 'audio' | 'compare';
  inputRef: string; // file_id or text
  options?: {
    length?: 'short' | 'medium' | 'long';
  };
}
