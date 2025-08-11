'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/FileUploader';
import UploadedFilesSidebar from '@/components/UploadedFilesSidebar';
import { nanoid } from 'nanoid';

interface UploadedFile {
  id: string;
  name: string;
  src: string;
  size: number;
  uploadedAt: Date;
}

export default function HomePage(): React.JSX.Element {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

  const handleFileUploaded = useCallback((file: File) => {
    // Create a new uploaded file entry
    const newFile: UploadedFile = {
      id: nanoid(),
      name: file.name,
      src: URL.createObjectURL(file),
      size: file.size,
      uploadedAt: new Date(),
    };

    setUploadedFiles((prev) => [newFile, ...prev]);
  }, []);

  const handleFileSelect = useCallback((file: UploadedFile) => {
    // Navigate to editor with the selected file
    // You can implement your own logic here to handle file selection
    console.log('Selected file:', file);
    // For now, just log the selection
  }, []);

  const handleFileDelete = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  const handleUploadNew = useCallback(() => {
    // This will trigger the file input in the FileUploader
    // You can implement additional logic here if needed
  }, []);

  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
  };

  return (
    <div className='min-h-screen bg-neutral-50 text-neutral-900 flex'>
      {/* Main Content Area - File Uploader */}
      <div className='flex-1 flex flex-col items-center justify-center p-12'>
        <FileUploader onFileUploaded={handleFileUploaded} className='w-full' />
      </div>

      {/* Right Sidebar - Uploaded Files */}
      <UploadedFilesSidebar
        files={uploadedFiles}
        onFileSelect={handleFileSelect}
        onFileDelete={handleFileDelete}
        onUploadNew={handleUploadNew}
        onClearAll={handleClearAll}
        maxFiles={5}
      />
    </div>
  );
}
