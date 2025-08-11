// Storage-related interfaces
export interface UploadedFile {
  id: string;
  name: string;
  src: string;
  size: number;
  uploadedAt: Date;
}

export interface StorageInfo {
  totalSize: number;
  usagePercentage: number;
  warningMessage: string | null;
}
