'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store';
import { setBackground, commitSnapshot } from '@/store';
import { computeViewportFit } from '@/lib/editor/display';

export default function FileUploader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (file: File) => {
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

      // Navigate to editor
      router.push('/editor');
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Image processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [dispatch, router]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  }, [processImage]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file) {
        processImage(file);
      }
    }
  }, [processImage]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSampleImage = useCallback((src: string) => {
    // For now, we'll create a placeholder image
    // In a real app, you'd fetch actual sample images
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Sample Image', 400, 300);
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'sample.png', { type: 'image/png' });
        processImage(file);
      }
    }, 'image/png');
  }, [processImage]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex">
      {/* Left column - flex-1 */}
      <div className="flex-1"></div>
      
      {/* Content column */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Upload Area */}
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-text-primary mb-4">
              Drag or upload your own images
            </h1>
          </div>

          {/* Dashed Dropzone */}
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
              ${isDragOver 
                ? 'border-blue-500/70 bg-blue-50/40' 
                : 'border-neutral-300 bg-white hover:border-neutral-400'
              }
              ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
              h-[78vh] flex flex-col items-center justify-center
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-label="Upload image"
          >
            {/* Upload Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-grey-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-10 h-10 text-grey-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
              </div>
            </div>

            {/* Upload CTA */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleClick}
                className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium px-8 py-3 rounded-full hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                Upload Image
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Sample Images Text */}
            <p className="text-text-secondary mb-4">No photo? Try one of ours.</p>

            {/* Sample Thumbnails */}
            <div className="flex gap-4 justify-center">
              {[
                { id: 1, src: '/sample1.jpg', alt: 'Sample 1' },
                { id: 2, src: '/sample2.jpg', alt: 'Sample 2' },
                { id: 3, src: '/sample3.jpg', alt: 'Sample 3' },
              ].map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSampleImage(sample.src)}
                  className="w-16 h-16 bg-grey-200 rounded-lg hover:scale-105 transition-transform duration-200 border border-grey-300"
                  aria-label="Use sample image"
                >
                  <div className="w-full h-full flex items-center justify-center text-grey-500 text-xs">
                    Sample {sample.id}
                  </div>
                </button>
              ))}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-primary-main">
                <div className="w-4 h-4 border-2 border-primary-main border-t-transparent rounded-full animate-spin"></div>
                <span>Processing image...</span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-error-light border border-error-main rounded-lg">
              <div className="flex items-center gap-2 text-error-main">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar - 340px */}
      <div className="w-[340px] border-l border-neutral-200 bg-white p-6">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Batch Editor</h2>
            <button
              type="button"
              onClick={handleClick}
              className="w-full bg-grey-100 hover:bg-grey-200 text-grey-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Upload Image
            </button>
          </div>

          {/* Footer */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-secondary">0/50</span>
              <button
                type="button"
                disabled
                className="text-grey-400 px-3 py-1 rounded-full text-sm font-medium cursor-not-allowed"
              >
                Clear All
              </button>
            </div>
            <button
              type="button"
              className="w-full bg-grey-100 hover:bg-grey-200 text-grey-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
