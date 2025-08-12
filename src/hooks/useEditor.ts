'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store';
import { setBackground } from '@/store';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, STORAGE_LIMITS } from '@/constants';
import { type UploadedFile } from '@/types';

export function useEditor() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [uploadedFiles, setUploadedFiles] = useLocalStorage<UploadedFile[]>(
    STORAGE_KEYS.UPLOADED_FILES,
    [],
  );

  // UI State
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Handle file selection from sidebar
  const handleFileSelect = useCallback(
    async (file: UploadedFile) => {
      try {
        // Get image dimensions from the stored base64 string
        const img = new Image();
        img.onload = () => {
          dispatch(
            setBackground({
              src: file.src,
              originalWidth: img.naturalWidth,
              originalHeight: img.naturalHeight,
              displayWidth: img.naturalWidth,
              displayHeight: img.naturalHeight,
            }),
          );
        };
        img.src = file.src;
      } catch (error) {
        console.error('Failed to get image dimensions:', error);
        alert('Failed to load the selected image. Please try again.');
      }
    },
    [dispatch],
  );

  // Handle file deletion
  const handleFileDelete = useCallback(
    (fileId: string) => {
      setUploadedFiles((prev) => {
        const updated = prev.filter((file) => file.id !== fileId);
        return updated;
      });
    },
    [setUploadedFiles],
  );

  // Handle upload new image
  const handleUploadNew = useCallback(() => {
    router.push('/');
  }, [router]);

  // Handle clear all files
  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
  }, [setUploadedFiles]);

  // Handle text layer updates
  const handleTextUpdate = useCallback((id: string, updates: any) => {
    // TODO: Implement text layer updates
    console.log('Text update:', id, updates);
  }, []);

  return {
    uploadedFiles,
    selectedId,
    setSelectedId,
    handleFileSelect,
    handleFileDelete,
    handleUploadNew,
    handleClearAll,
    handleTextUpdate,
    maxFiles: STORAGE_LIMITS.MAX_FILES,
    maxStorageSize: STORAGE_LIMITS.MAX_STORAGE_SIZE,
  };
}
