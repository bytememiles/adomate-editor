'use client';

import { useState, useRef } from 'react';
import { Stage } from 'konva/lib/Stage';
import { usePngExport, useExportValidation } from '@/lib/export';

export default function ExportControls() {
  const stageRef = useRef<Stage | null>(null);
  const {
    exportCanvas,
    exportWithName,
    exportWithQuality,
    isExporting,
    lastExport,
    exportError,
    clearError,
  } = usePngExport();

  const { validationWarnings, checkExportQuality, clearWarnings } = useExportValidation();

  const [customFilename, setCustomFilename] = useState('my-export');
  const [quality, setQuality] = useState(1.0);

  const handleQuickExport = async () => {
    try {
      const result = await exportCanvas(stageRef);
      if (result) {
        checkExportQuality(result);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleNamedExport = async () => {
    try {
      const result = await exportWithName(stageRef, customFilename);
      if (result) {
        checkExportQuality(result);
      }
    } catch (error) {
      console.error('Named export failed:', error);
    }
  };

  const handleQualityExport = async () => {
    try {
      const result = await exportWithQuality(stageRef, quality, customFilename);
      if (result) {
        checkExportQuality(result);
      }
    } catch (error) {
      console.error('Quality export failed:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-grey-300 p-4 mb-6'>
      <h3 className='text-lg font-medium text-text-primary mb-4'>PNG Export Controls</h3>

      {/* Export Options */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <div>
          <label className='block text-sm font-medium text-text-secondary mb-2'>
            Custom Filename
          </label>
          <input
            type='text'
            value={customFilename}
            onChange={(e) => setCustomFilename(e.target.value)}
            className='w-full px-3 py-2 border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent'
            placeholder='my-export'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-text-secondary mb-2'>
            Quality (0.1 - 1.0)
          </label>
          <input
            type='range'
            min='0.1'
            max='1.0'
            step='0.1'
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className='w-full'
          />
          <span className='text-sm text-text-secondary'>{quality}</span>
        </div>
      </div>

      {/* Export Buttons */}
      <div className='flex flex-wrap gap-3 mb-4'>
        <button
          onClick={handleQuickExport}
          disabled={isExporting}
          className='bg-primary-main hover:bg-primary-dark disabled:bg-grey-300 text-white px-4 py-2 rounded-lg font-medium transition-colors'
        >
          {isExporting ? 'Exporting...' : 'Quick Export'}
        </button>

        <button
          onClick={handleNamedExport}
          disabled={isExporting}
          className='bg-secondary-main hover:bg-secondary-dark disabled:bg-grey-300 text-white px-4 py-2 rounded-lg font-medium transition-colors'
        >
          Export with Name
        </button>

        <button
          onClick={handleQualityExport}
          disabled={isExporting}
          className='bg-success-main hover:bg-success-dark disabled:bg-grey-300 text-white px-4 py-2 rounded-lg font-medium transition-colors'
        >
          Export with Quality
        </button>
      </div>

      {/* Export Status */}
      {isExporting && (
        <div className='mb-4 p-3 bg-info-light border border-info-main rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 border-2 border-info-main border-t-transparent rounded-full animate-spin'></div>
            <span className='text-info-main text-sm'>Exporting PNG...</span>
          </div>
        </div>
      )}

      {/* Export Results */}
      {lastExport && (
        <div className='mb-4 p-3 bg-success-light border border-success-main rounded-lg'>
          <h4 className='font-medium text-success-main mb-2'>Export Successful!</h4>
          <div className='text-sm text-success-main space-y-1'>
            <p>Filename: {lastExport.filename}</p>
            <p>
              Original: {lastExport.originalDimensions.width} ×{' '}
              {lastExport.originalDimensions.height}
            </p>
            <p>
              Export: {lastExport.exportDimensions.width} × {lastExport.exportDimensions.height}
            </p>
            <p>Pixel Ratio: {lastExport.pixelRatio}</p>
            {lastExport.fileSize && <p>File Size: {formatFileSize(lastExport.fileSize)}</p>}
          </div>

          {/* Background Info */}
          <div className='mt-3 pt-3 border-t border-success-main/30'>
            <h5 className='font-medium text-success-main mb-1'>Background Information</h5>
            <div className='text-xs text-success-main/80 space-y-1'>
              <p>
                Original: {lastExport.originalDimensions.width} ×{' '}
                {lastExport.originalDimensions.height}
              </p>
              <p>
                Display: {Math.round(lastExport.exportDimensions.width / lastExport.pixelRatio)} ×{' '}
                {Math.round(lastExport.exportDimensions.height / lastExport.pixelRatio)}
              </p>
              <p>Ratio: {lastExport.pixelRatio.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <div className='mb-4 p-3 bg-warning-light border border-warning-main rounded-lg'>
          <h4 className='font-medium text-warning-main mb-2'>Export Validation Warnings</h4>
          <ul className='text-sm text-warning-main space-y-1'>
            {validationWarnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
          <button
            onClick={clearWarnings}
            className='mt-2 text-warning-main hover:text-warning-dark text-sm underline'
          >
            Dismiss Warnings
          </button>
        </div>
      )}

      {/* Export Errors */}
      {exportError && (
        <div className='mb-4 p-3 bg-error-light border border-error-main rounded-lg'>
          <div className='flex items-center justify-between'>
            <span className='text-error-main text-sm'>{exportError}</span>
            <button
              onClick={clearError}
              className='text-error-main hover:text-error-dark text-sm underline'
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className='text-xs text-text-secondary mt-4'>
        <p>💾 Exports maintain original pixel dimensions for crisp quality.</p>
        <p>⚡ Pixel ratio is automatically calculated from background dimensions.</p>
        <p>🔍 Validation ensures export quality matches original size.</p>
      </div>
    </div>
  );
}
