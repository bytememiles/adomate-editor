'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader, { FileUploaderRef } from '@/components/FileUploader';
import UploadedFilesSidebar from '@/components/UploadedFilesSidebar';
import { nanoid } from 'nanoid';
import { checkLocalStorageSpace, wouldExceedStorageLimit } from '@/utils';
import { type UploadedFile } from '@/types';
import { STORAGE_KEYS, STORAGE_LIMITS } from '@/constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAppDispatch } from '@/store';
import { setBackground } from '@/store';

export default function HomePage(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileUploaderRef = useRef<FileUploaderRef>(null);
  const [uploadedFiles, setUploadedFiles] = useLocalStorage<UploadedFile[]>(
    STORAGE_KEYS.UPLOADED_FILES,
    [],
  );
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  // Check storage space whenever files change
  useEffect(() => {
    const storageInfo = checkLocalStorageSpace(uploadedFiles, STORAGE_LIMITS.MAX_STORAGE_SIZE);
    setStorageWarning(storageInfo.warningMessage);
  }, [uploadedFiles]);

  // Listen for navigation events to refresh localStorage data
  useEffect(() => {
    const handleFocus = () => {
      // When the page gains focus (e.g., user navigates back), refresh localStorage data
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert stored dates back to Date objects
          const filesWithDates = parsed.map((file: any) => ({
            ...file,
            uploadedAt: new Date(file.uploadedAt),
          }));
          setUploadedFiles(filesWithDates);
        }
      } catch (error) {
        console.error('Failed to refresh localStorage data:', error);
      }
    };

    // Listen for page focus events
    window.addEventListener('focus', handleFocus);

    // Also listen for visibility change events (when user switches tabs back)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        handleFocus();
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [setUploadedFiles]);

  // Convert file to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Get image dimensions from base64 string
  const getImageDimensions = (base64String: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
      img.src = base64String;
    });
  };

  // Clean up old files when storage limit is reached
  const cleanupOldFiles = useCallback((files: UploadedFile[]) => {
    if (files.length >= STORAGE_LIMITS.MAX_FILES) {
      // Remove oldest files to make room for new ones
      return files.slice(0, STORAGE_LIMITS.MAX_FILES - 1);
    }
    return files;
  }, []);

  // Clean up files when storage size limit is reached
  const cleanupStorageSpace = useCallback((files: UploadedFile[]) => {
    let totalSize = files.reduce((acc, file) => acc + file.size, 0);

    // If we're over the limit, remove oldest files until we're under
    while (totalSize > STORAGE_LIMITS.MAX_STORAGE_SIZE && files.length > 0) {
      const removedFile = files.pop(); // Remove oldest file
      if (removedFile) {
        totalSize -= removedFile.size;
      }
    }

    return files;
  }, []);

  const handleFileUploaded = useCallback(
    async (file: File) => {
      try {
        console.log('File uploaded:', file);

        // Check if adding this file would exceed storage limit
        if (wouldExceedStorageLimit(uploadedFiles, file.size, STORAGE_LIMITS.MAX_STORAGE_SIZE)) {
          alert('Storage limit exceeded. Please delete some files before uploading.');
          return;
        }

        // Convert file to base64 for localStorage storage
        const base64String = await fileToBase64(file);
        console.log('File converted to base64, length:', base64String.length);

        // Get image dimensions
        const { width, height } = await getImageDimensions(base64String);
        console.log('Image dimensions:', { width, height });

        // Create a new uploaded file entry
        const newFile: UploadedFile = {
          id: nanoid(),
          name: file.name,
          src: base64String, // Store base64 instead of blob URL
          size: file.size,
          uploadedAt: new Date(),
        };
        console.log('Created new file entry:', newFile);

        setUploadedFiles((prev) => {
          const updated = [newFile, ...prev];
          const cleanedByCount = cleanupOldFiles(updated);
          const cleanedBySize = cleanupStorageSpace(cleanedByCount);
          return cleanedBySize;
        });

        // Set the background in Redux store
        const backgroundData = {
          src: base64String,
          originalWidth: width,
          originalHeight: height,
          displayWidth: width,
          displayHeight: height,
        };
        console.log('Setting background in store:', backgroundData);

        dispatch(setBackground(backgroundData));
        console.log('Background set in store successfully');

        // Navigate to editor page with the uploaded image
        router.push('/editor');
      } catch (error) {
        console.error('Failed to convert file to base64:', error);
      }
    },
    [uploadedFiles, cleanupOldFiles, cleanupStorageSpace, router, setUploadedFiles, dispatch],
  );

  const handleFileSelect = useCallback(
    async (file: UploadedFile) => {
      try {
        console.log('Selected file:', file);

        // Get image dimensions from the stored base64 string
        const { width, height } = await getImageDimensions(file.src);
        console.log('Image dimensions:', { width, height });

        // Set the background in Redux store
        const backgroundData = {
          src: file.src,
          originalWidth: width,
          originalHeight: height,
          displayWidth: width,
          displayHeight: height,
        };
        console.log('Setting background in store:', backgroundData);

        dispatch(setBackground(backgroundData));
        console.log('Background set in store successfully');

        // Navigate to editor page with the selected image
        router.push('/editor');
      } catch (error) {
        console.error('Failed to get image dimensions:', error);
        alert('Failed to load the selected image. Please try again.');
      }
    },
    [router, dispatch],
  );

  const handleFileDelete = useCallback(
    (fileId: string) => {
      setUploadedFiles((prev) => {
        const updated = prev.filter((file) => file.id !== fileId);
        return updated;
      });
    },
    [setUploadedFiles],
  );

  const handleUploadNew = useCallback(() => {
    // Trigger file selection in the FileUploader component
    if (fileUploaderRef.current) {
      fileUploaderRef.current.triggerFileSelect();
    }
  }, []);

  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
  }, [setUploadedFiles]);

  return (
    <div className='min-h-screen bg-neutral-50 text-neutral-900 flex'>
      {/* Main Content Area - File Uploader */}
      <div className='flex-1 flex flex-col items-center justify-center p-12'>
        <FileUploader
          ref={fileUploaderRef}
          onFileUploaded={handleFileUploaded}
          className='w-full'
        />
      </div>

      {/* Right Sidebar - Uploaded Files */}
      <UploadedFilesSidebar
        files={uploadedFiles}
        onFileSelect={handleFileSelect}
        onFileDelete={handleFileDelete}
        onUploadNew={handleUploadNew}
        onClearAll={handleClearAll}
        maxFiles={STORAGE_LIMITS.MAX_FILES}
        storageWarning={storageWarning}
        maxStorageSize={STORAGE_LIMITS.MAX_STORAGE_SIZE}
      />
    </div>
  );
}
