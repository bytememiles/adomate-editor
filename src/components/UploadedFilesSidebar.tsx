'use client';

import { useState } from 'react';
import { ChevronRight, Image as ImageIcon, Plus, Trash2, HelpCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  src: string;
  size: number;
  uploadedAt: Date;
}

interface UploadedFilesSidebarProps {
  files: UploadedFile[];
  onFileSelect: (file: UploadedFile) => void;
  onFileDelete: (fileId: string) => void;
  onUploadNew: () => void;
  onClearAll: () => void;
  maxFiles?: number;
  className?: string;
}

export default function UploadedFilesSidebar({
  files,
  onFileSelect,
  onFileDelete,
  onUploadNew,
  onClearAll,
  maxFiles = 5,
  className = '',
}: UploadedFilesSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const usedStorage = files.length;
  const storagePercentage = (usedStorage / maxFiles) * 100;

  return (
    <>
      {/* Sidebar Toggle Button */}
      <div className='relative flex items-center'>
        <button
          onClick={toggleSidebar}
          className={`absolute -left-[24px] z-10 w-6 h-20 bg-white border border-neutral-200 rounded-l-lg hover:bg-neutral-50 transition-colors flex items-center justify-center shadow-sm ${
            !isCollapsed ? 'border-r-0' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight
            className={`w-4 h-4 text-neutral-600 transition-transform duration-200 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Right Sidebar */}
      <div
        className={`border-l border-neutral-200 bg-white transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-0 overflow-hidden' : 'w-[340px]'
        } ${className}`}
      >
        <div className='h-full flex flex-col p-6'>
          {/* Section 1: Uploaded Files List */}
          <div className='flex-1 mb-4'>
            <h3 className='text-sm font-medium text-text-primary mb-3'>Uploaded Files</h3>
            <div className='h-full space-y-2'>
              {files.length === 0 ? (
                <div className='flex-1 flex items-center justify-center h-full'>
                  <div className='text-center'>
                    <ImageIcon className='w-12 h-12 text-grey-300 mx-auto mb-2' />
                    <p className='text-sm text-grey-500'>No files uploaded yet</p>
                  </div>
                </div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className='group relative bg-white border border-neutral-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer'
                    onClick={() => onFileSelect(file)}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 bg-grey-100 rounded-lg overflow-hidden flex-shrink-0'>
                        <img
                          src={file.src}
                          alt={file.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-text-primary truncate'>
                          {file.name}
                        </p>
                        <p className='text-xs text-text-secondary'>
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileDelete(file.id);
                        }}
                        className='opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all duration-200'
                        title='Delete file'
                      >
                        <Trash2 className='w-4 h-4 text-red-500' />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Upload Button and Storage Usage */}
          <div className='border-t border-neutral-200 pt-2 mt-auto'>
            {/* Upload Button */}
            <div className='mb-4'>
              <button
                type='button'
                onClick={onUploadNew}
                className='w-full bg-grey-200 hover:bg-grey-300 text-grey-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center'
              >
                <Plus className='w-4 h-4' />
                Upload Image
              </button>
            </div>

            {/* Storage Capacity Section */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-text-primary'>Storage</span>
                <span className='text-sm text-text-secondary'>
                  {Math.round(storagePercentage)}% used
                </span>
              </div>
              <div className='w-full bg-neutral-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    storagePercentage > 80
                      ? 'bg-red-500'
                      : storagePercentage > 60
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-text-secondary ml-1'>
                  {usedStorage}/{maxFiles}
                </span>
                <button
                  type='button'
                  onClick={onClearAll}
                  disabled={files.length === 0}
                  className='text-grey-400 hover:text-red-500 py-1 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed'
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
