'use client';

import { computeViewportFit } from '@/lib/editor/display';
import { commitSnapshot, setBackground, useAppDispatch } from '@/store';
import { AlertCircle, CloudUpload, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface FileUploaderProps {
  onFileUploaded?: (file: File) => void;
  className?: string;
}

export interface FileUploaderRef {
  triggerFileSelect: () => void;
}

const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
  ({ onFileUploaded, className = '' }, ref) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewFileName, setPreviewFileName] = useState<string | null>(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      triggerFileSelect: () => {
        fileInputRef.current?.click();
      },
    }));

    const processImage = useCallback(
      async (file: File) => {
        if (!file.type.startsWith('image/')) {
          setError('Please select an image file');
          return;
        }

        setIsProcessing(true);
        setError(null);

        try {
          // Create image element to get dimensions
          const img = new Image();
          const objectUrl = URL.createObjectURL(file);

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = objectUrl;
          });

          // Compute display fit
          const displayFit = computeViewportFit(img.naturalWidth, img.naturalHeight);

          // Create background object
          const background = {
            src: objectUrl,
            originalWidth: img.naturalWidth,
            originalHeight: img.naturalHeight,
            displayWidth: displayFit.displayWidth,
            displayHeight: displayFit.displayHeight,
          };

          // Dispatch actions
          dispatch(setBackground(background));
          dispatch(commitSnapshot());

          // Set preview using the blob URL for immediate display
          setPreviewImage(objectUrl);
          setPreviewFileName(file.name);

          // Call the callback if provided
          if (onFileUploaded) {
            onFileUploaded(file);
          }
          // Note: Navigation to editor is now handled by the parent component
        } catch (err) {
          setError('Failed to process image. Please try again.');
          console.error('Image processing error:', err);
        } finally {
          setIsProcessing(false);
        }
      },
      [dispatch, onFileUploaded],
    );

    const handleFileSelect = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          processImage(file);
        }
      },
      [processImage],
    );

    const handleDragOver = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
      (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);

        const files = event.dataTransfer.files;
        if (files.length > 0) {
          const file = files[0];
          if (file) {
            processImage(file);
          }
        }
      },
      [processImage],
    );

    const handleClick = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    const clearPreview = useCallback(() => {
      setPreviewImage(null);
      setPreviewFileName(null);
    }, []);

    return (
      <div className={`w-full ${className}`}>
        {/* Dashed Dropzone */}
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
            ${
              isDragOver
                ? 'border-blue-500/70 bg-blue-50/40'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
            h-[78vh] flex flex-col items-center justify-center
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label='Upload image'
        >
          {previewImage ? (
            // Preview Mode
            <div className='w-full h-full flex flex-col items-center justify-center'>
              <div className='relative w-full h-full flex items-center justify-center'>
                <img
                  src={previewImage}
                  alt={previewFileName || 'Preview'}
                  className='max-w-full max-h-full object-contain rounded-lg'
                />
                <button
                  onClick={clearPreview}
                  className='absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors'
                  title='Remove preview'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            </div>
          ) : (
            // Upload Mode
            <>
              {/* Header */}
              <div className='text-center mb-8'>
                <h1 className='text-2xl font-semibold text-text-primary mb-4'>
                  Drag or upload your own images
                </h1>
              </div>

              {/* Upload Icon */}
              <div className='mb-6'>
                <div className='w-20 h-20 mx-auto bg-grey-100 rounded-full flex items-center justify-center'>
                  <CloudUpload className='w-10 h-10 text-grey-400' />
                </div>
              </div>

              {/* Upload CTA */}
              <div className='mb-6'>
                <button
                  type='button'
                  onClick={handleClick}
                  className='bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium px-8 py-3 rounded-full hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto'
                >
                  <ImageIcon className='w-5 h-5' />
                  Upload Image
                </button>
              </div>
            </>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type='file'
            accept='image/png,image/jpeg'
            onChange={handleFileSelect}
            className='hidden'
          />
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className='mt-6 text-center'>
            <div className='inline-flex items-center gap-2 text-primary-main'>
              <Loader2 className='w-4 h-4 animate-spin' />
              <span>Processing image...</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className='mt-6 p-4 bg-error-light border border-error-main rounded-lg'>
            <div className='flex items-center gap-2 text-error-main'>
              <AlertCircle className='w-5 h-5' />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

FileUploader.displayName = 'FileUploader';

export default FileUploader;
