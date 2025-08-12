import { nanoid } from 'nanoid';

import type { CanvasElement, Layer, Project, User } from '@/types';

export const generateId = (): string => nanoid();

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const createNewProject = (name: string, ownerId: string): Project => {
  const now = new Date();

  return {
    id: generateId(),
    name,
    description: '',
    ownerId,
    createdAt: now,
    updatedAt: now,
  };
};

export const createNewLayer = (name: string): Layer => {
  return {
    id: generateId(),
    name,
    visible: true,
    locked: false,
    elements: [],
  };
};

export const createNewElement = (
  type: CanvasElement['type'],
  x: number,
  y: number,
): CanvasElement => {
  return {
    id: generateId(),
    type,
    x,
    y,
    width: 100,
    height: 100,
    properties: {},
  };
};

export const validateUser = (user: Partial<User>): user is User => {
  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    user.createdAt instanceof Date
  );
};

/**
 * Truncate a file name intelligently, preserving the file extension
 * @param fileName - The full file name to truncate
 * @param maxLength - Maximum length for the truncated name (default: 20)
 * @returns Truncated file name with preserved extension
 */
export function truncateFileName(fileName: string, maxLength: number = 20): string {
  if (fileName.length <= maxLength) {
    return fileName;
  }

  const lastDot = fileName.lastIndexOf('.');

  // No extension or hidden file, just truncate middle
  if (lastDot === -1 || lastDot === 0) {
    const startLen = Math.ceil((maxLength - 3) / 2); // 3 for '...'
    const endLen = Math.floor((maxLength - 3) / 2);
    return fileName.slice(0, startLen) + '...' + fileName.slice(-endLen);
  }

  const extension = fileName.slice(lastDot);
  const baseName = fileName.slice(0, lastDot);
  const maxBaseLength = maxLength - extension.length - 3; // 3 for '...'

  // Extension is too long, just truncate base to minimum
  if (maxBaseLength <= 6) {
    return baseName.slice(0, 6) + '...' + extension;
  }

  // Truncate base name in the middle, preserving extension
  const startLen = Math.ceil(maxBaseLength / 2);
  const endLen = Math.floor(maxBaseLength / 2);

  return baseName.slice(0, startLen) + '...' + baseName.slice(-endLen) + extension;
}

/**
 * Get file extension from file name
 * @param fileName - The file name to extract extension from
 * @returns File extension (including the dot) or empty string if no extension
 */
export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot === -1 ? '' : fileName.slice(lastDot);
}

/**
 * Get file name without extension
 * @param fileName - The file name to remove extension from
 * @returns File name without extension
 */
export function getFileNameWithoutExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot === -1 ? fileName : fileName.slice(0, lastDot);
}

/**
 * Check if a file is an image based on its extension
 * @param fileName - The file name to check
 * @returns True if the file is an image
 */
export function isImageFile(fileName: string): boolean {
  const extension = getFileExtension(fileName).toLowerCase();
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  return imageExtensions.includes(extension);
}
