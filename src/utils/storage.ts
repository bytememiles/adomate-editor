import type { UploadedFile, StorageInfo } from '@/types';
import { STORAGE_WARNING_THRESHOLDS } from '@/constants';

/**
 * Check localStorage space usage and return storage information
 * @param files Array of uploaded files
 * @param maxStorageSize Maximum storage size in bytes (default: 5MB)
 * @returns StorageInfo object with total size, usage percentage, and warning message
 */
export function checkLocalStorageSpace(
  files: UploadedFile[],
  maxStorageSize: number = 5 * 1024 * 1024,
): StorageInfo {
  try {
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const usagePercentage = (totalSize / maxStorageSize) * 100;

    let warningMessage: string | null = null;

    if (usagePercentage > STORAGE_WARNING_THRESHOLDS.CRITICAL) {
      warningMessage = `Storage almost full: ${usagePercentage.toFixed(1)}% used`;
    } else if (usagePercentage > STORAGE_WARNING_THRESHOLDS.WARNING) {
      warningMessage = `Storage getting full: ${usagePercentage.toFixed(1)}% used`;
    }

    return {
      totalSize,
      usagePercentage,
      warningMessage,
    };
  } catch (error) {
    console.error('Failed to check storage space:', error);
    return {
      totalSize: 0,
      usagePercentage: 0,
      warningMessage: null,
    };
  }
}

/**
 * Check if adding a new file would exceed storage limit
 * @param files Current array of uploaded files
 * @param newFileSize Size of the new file in bytes
 * @param maxStorageSize Maximum storage size in bytes (default: 5MB)
 * @returns True if adding the file would exceed the limit
 */
export function wouldExceedStorageLimit(
  files: UploadedFile[],
  newFileSize: number,
  maxStorageSize: number = 5 * 1024 * 1024,
): boolean {
  try {
    const currentSize = files.reduce((acc, file) => acc + file.size, 0);
    return currentSize + newFileSize > maxStorageSize;
  } catch (error) {
    console.error('Failed to check storage limit:', error);
    return true; // Fail safe - assume limit would be exceeded
  }
}

/**
 * Get formatted storage size string
 * @param bytes Size in bytes
 * @returns Formatted size string (e.g., "2.5 MB")
 */
export function formatStorageSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Get storage usage percentage
 * @param files Array of uploaded files
 * @param maxStorageSize Maximum storage size in bytes (default: 5MB)
 * @returns Usage percentage (0-100)
 */
export function getStorageUsagePercentage(
  files: UploadedFile[],
  maxStorageSize: number = 5 * 1024 * 1024,
): number {
  try {
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    return (totalSize / maxStorageSize) * 100;
  } catch (error) {
    console.error('Failed to get storage usage percentage:', error);
    return 0;
  }
}

/**
 * Get total storage size used
 * @param files Array of uploaded files
 * @returns Total size in bytes
 */
export function getTotalStorageUsed(files: UploadedFile[]): number {
  try {
    return files.reduce((acc, file) => acc + file.size, 0);
  } catch (error) {
    console.error('Failed to get total storage used:', error);
    return 0;
  }
}
