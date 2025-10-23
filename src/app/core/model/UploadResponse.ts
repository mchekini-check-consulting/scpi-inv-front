export interface UploadResponse {
  message: string;
  fileName: string;
  originalName: string;
  size: number;
  contentType: string;
  error?: string;
}