'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectBackground,
  selectCanUndo,
  selectCanRedo,
  addTextLayer,
  undo,
  redo,
  setBackground,
} from '@/store';
import UploadedFilesSidebar from '@/components/UploadedFilesSidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, STORAGE_LIMITS } from '@/constants';
import { type UploadedFile } from '@/types';

export default function EditorPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const background = useAppSelector(selectBackground);
  const [uploadedFiles, setUploadedFiles] = useLocalStorage<UploadedFile[]>(
    STORAGE_KEYS.UPLOADED_FILES,
    [],
  );

  console.log('Editor page loaded, background:', background);

  // Redirect to home if no background
  useEffect(() => {
    console.log('Editor useEffect - background:', background);
    if (background === null) {
      console.log('No background found, redirecting to home');
      router.replace('/');
    }
  }, [background, router]);

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

  // Handle file selection from sidebar
  const handleFileSelect = useCallback(
    async (file: UploadedFile) => {
      try {
        // Get image dimensions from the stored base64 string
        const { width, height } = await getImageDimensions(file.src);

        // Set the background in Redux store
        dispatch(
          setBackground({
            src: file.src,
            originalWidth: width,
            originalHeight: height,
            displayWidth: width,
            displayHeight: height,
          }),
        );
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

  // Show loading while checking state
  if (background === null) {
    return (
      <div className='min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-text-secondary'>Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-50 text-neutral-900 flex'>
      {/* Desktop-only warning */}
      <div className='lg:hidden fixed inset-0 bg-grey-100 flex items-center justify-center p-8 z-50'>
        <div className='text-center max-w-md'>
          <h1 className='text-2xl font-semibold text-text-primary mb-4'>Desktop Only</h1>
          <p className='text-text-secondary'>
            This application is designed for desktop use only. Please use a device with a minimum
            width of 1024px.
          </p>
        </div>
      </div>

      {/* Main content - only visible on desktop */}
      <div className='hidden lg:flex lg:flex-col lg:flex-1'>
        {/* Top Toolbar */}
        <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-neutral-200 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => dispatch(addTextLayer())}
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl font-medium transition-colors flex items-center gap-2'
                title='Add Text Layer'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4v16m8-8H4'
                  />
                </svg>
                Add Text
              </button>

              <button
                onClick={() => router.push('/')}
                className='bg-grey-100 hover:bg-grey-200 text-grey-700 px-4 py-2 rounded-2xl font-medium transition-colors flex items-center gap-2'
                title='Upload New Background'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
                Upload PNG
              </button>
            </div>

            <div className='flex items-center gap-4'>
              <button
                onClick={() => dispatch(undo())}
                disabled={!useAppSelector(selectCanUndo)}
                className='p-2 rounded-lg hover:bg-grey-100 disabled:opacity-50 disabled:cursor-not-allowed'
                title='Undo (Ctrl+Z)'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
                  />
                </svg>
              </button>

              <button
                onClick={() => dispatch(redo())}
                disabled={!useAppSelector(selectCanRedo)}
                className='p-2 rounded-lg hover:bg-grey-100 disabled:opacity-50 disabled:cursor-not-allowed'
                title='Redo (Ctrl+Shift+Z)'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex flex-1'>
          {/* Canvas Area */}
          <div className='flex-1 flex items-center justify-center p-8'>
            <div
              className='relative bg-checkerboard'
              style={{
                width: background.displayWidth,
                height: background.displayHeight,
              }}
            >
              {/* Background Image */}
              <img
                src={background.src}
                alt='Background'
                className='w-full h-full object-cover'
                style={{
                  width: background.displayWidth,
                  height: background.displayHeight,
                }}
              />

              {/* Canvas Placeholder */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-center text-grey-500'>
                  <p className='text-sm'>Canvas Area</p>
                  <p className='text-xs'>Konva stage will be rendered here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='bg-white border-t border-neutral-200 px-6 py-3'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-text-secondary'>Ready to edit</div>
            <div className='text-sm text-text-secondary'>
              {background.displayWidth}px × {background.displayHeight}px
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Uploaded Files */}
      <UploadedFilesSidebar
        files={uploadedFiles}
        onFileSelect={handleFileSelect}
        onFileDelete={handleFileDelete}
        onUploadNew={handleUploadNew}
        onClearAll={handleClearAll}
        maxFiles={STORAGE_LIMITS.MAX_FILES}
        storageWarning={null}
        maxStorageSize={STORAGE_LIMITS.MAX_STORAGE_SIZE}
      />
    </div>
  );
}
