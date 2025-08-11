'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader, { FileUploaderRef } from '@/components/FileUploader';
import UploadedFilesSidebar from '@/components/UploadedFilesSidebar';
import { nanoid } from 'nanoid';
import { checkLocalStorageSpace, wouldExceedStorageLimit } from '@/utils';
import { type UploadedFile } from '@/types';
import { STORAGE_KEYS, STORAGE_LIMITS } from '@/constants';

export default function HomePage(): React.JSX.Element {
  const router = useRouter();
  const fileUploaderRef = useRef<FileUploaderRef>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  // Load uploaded files from localStorage on component mount
  useEffect(() => {
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
      console.error('Failed to load uploaded files from localStorage:', error);
    }
  }, []);

  // Save uploaded files to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(uploadedFiles));
    } catch (error) {
      console.error('Failed to save uploaded files to localStorage:', error);
    }
  }, [uploadedFiles]);

  // Check storage space whenever files change
  useEffect(() => {
    const storageInfo = checkLocalStorageSpace(uploadedFiles, STORAGE_LIMITS.MAX_STORAGE_SIZE);
    setStorageWarning(storageInfo.warningMessage);
  }, [uploadedFiles]);

  // Convert file to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
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
        // Check if adding this file would exceed storage limit
        if (wouldExceedStorageLimit(uploadedFiles, file.size, STORAGE_LIMITS.MAX_STORAGE_SIZE)) {
          alert('Storage limit exceeded. Please delete some files before uploading.');
          return;
        }

        // Convert file to base64 for localStorage storage
        const base64String = await fileToBase64(file);

        // Create a new uploaded file entry
        const newFile: UploadedFile = {
          id: nanoid(),
          name: file.name,
          src: base64String, // Store base64 instead of blob URL
          size: file.size,
          uploadedAt: new Date(),
        };

        setUploadedFiles((prev) => {
          const updated = [newFile, ...prev];
          const cleanedByCount = cleanupOldFiles(updated);
          const cleanedBySize = cleanupStorageSpace(cleanedByCount);
          return cleanedBySize;
        });

        // Navigate to editor page with the uploaded image
        router.push('/editor');
      } catch (error) {
        console.error('Failed to convert file to base64:', error);
      }
    },
    [uploadedFiles, cleanupOldFiles, cleanupStorageSpace, router],
  );

  const handleFileSelect = useCallback(
    (file: UploadedFile) => {
      // Navigate to editor page with the selected image
      router.push('/editor');
      // Note: You might want to set the selected file in your store here
      // so the editor knows which image to load
    },
    [router],
  );

  const handleFileDelete = useCallback((fileId: string) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((file) => file.id !== fileId);
      return updated;
    });
  }, []);

  const handleUploadNew = useCallback(() => {
    // Trigger file selection in the FileUploader component
    if (fileUploaderRef.current) {
      fileUploaderRef.current.triggerFileSelect();
    }
  }, []);

  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
  }, []);

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
