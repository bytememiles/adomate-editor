'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { selectBackground } from '@/store';
import UploadedFilesSidebar from '@/components/UploadedFilesSidebar';
import {
  EditorToolbar,
  CanvasControls,
  CanvasWorkspace,
  DesktopWarning,
  LoadingSpinner,
} from '@/components/editor';
import { useEditor } from '@/hooks/useEditor';

export default function EditorPage() {
  const router = useRouter();
  const background = useAppSelector(selectBackground);
  const {
    uploadedFiles,
    selectedId,
    handleFileSelect,
    handleFileDelete,
    handleUploadNew,
    handleClearAll,
    handleTextUpdate,
    maxFiles,
    maxStorageSize,
  } = useEditor();

  console.log('Editor page loaded, background:', background);

  // Redirect to home if no background
  useEffect(() => {
    if (background === null) {
      router.replace('/');
    }
  }, [background, router]);

  // Show loading while checking state
  if (background === null) {
    return <LoadingSpinner />;
  }

  return (
    <div className='min-h-screen bg-neutral-50 text-neutral-900 flex'>
      {/* Desktop-only warning */}
      <DesktopWarning />

      {/* Main content - only visible on desktop */}
      <div className='hidden lg:flex lg:flex-col lg:flex-1 relative'>
        {/* 1. Top Text Toolbar */}
        <EditorToolbar selectedId={selectedId} onTextUpdate={handleTextUpdate} />

        {/* 2. Canvas Workspace Area */}
        <div className='flex-1 relative'>
          {/* Canvas Controls - Positioned around canvas */}
          <CanvasControls background={background} />

          {/* Canvas Workspace - Main canvas area */}
          <CanvasWorkspace background={background} selectedId={selectedId} />
        </div>
      </div>

      {/* Right Sidebar - Uploaded Files */}
      <UploadedFilesSidebar
        files={uploadedFiles}
        onFileSelect={handleFileSelect}
        onFileDelete={handleFileDelete}
        onUploadNew={handleUploadNew}
        onClearAll={handleClearAll}
        maxFiles={maxFiles}
        storageWarning={null}
        maxStorageSize={maxStorageSize}
      />
    </div>
  );
}
