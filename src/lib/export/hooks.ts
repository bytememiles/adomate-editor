import { useState, useCallback } from 'react';
import { useAppSelector } from '@/store';
import { exportStageToPng, downloadImage, validateExport } from './service';
import { selectBackground } from '@/store';
import type { Stage } from 'konva/lib/Stage';
import type { ExportOptions, ExportResult } from './service';

/**
 * Hook for PNG export functionality
 */
export function usePngExport() {
  const background = useAppSelector(selectBackground);
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<ExportResult | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportCanvas = useCallback(
    async (stageRef: React.RefObject<Stage | null>, options: ExportOptions = {}) => {
      if (!stageRef.current) {
        setExportError('Stage reference is not available');
        return;
      }

      setIsExporting(true);
      setExportError(null);

      try {
        const result = await exportStageToPng(stageRef.current, background, options);

        if (!result.success || !result.dataUrl) {
          throw new Error(result.error || 'Export failed');
        }

        // Validate export quality
        const validation = validateExport(
          result.originalDimensions,
          result.exportDimensions,
          result.pixelRatio,
        );

        // Trigger download
        downloadImage(result.dataUrl, result.filename);

        const exportResult = { ...result, validation };
        setLastExport(exportResult);
        return exportResult;
      } catch (error: any) {
        const errorMessage = error?.message || 'Export failed';
        setExportError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsExporting(false);
      }
    },
    [background],
  );

  const exportWithName = useCallback(
    async (stageRef: React.RefObject<Stage | null>, filename: string) => {
      return exportCanvas(stageRef, { filename });
    },
    [exportCanvas],
  );

  const exportWithQuality = useCallback(
    async (stageRef: React.RefObject<Stage | null>, quality: number, filename?: string) => {
      const options: ExportOptions = { quality };
      if (filename) options.filename = filename;
      return exportCanvas(stageRef, options);
    },
    [exportCanvas],
  );

  const clearError = useCallback(() => {
    setExportError(null);
  }, []);

  const clearLastExport = useCallback(() => {
    setLastExport(null);
  }, []);

  return {
    exportCanvas,
    exportWithName,
    exportWithQuality,
    isExporting,
    lastExport,
    exportError,
    clearError,
    clearLastExport,
  };
}

/**
 * Hook for export validation and quality checking
 */
export function useExportValidation() {
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const checkExportQuality = useCallback((exportResult: any) => {
    if (exportResult?.validation) {
      setValidationWarnings(exportResult.validation.warnings || []);
      return exportResult.validation.valid;
    }
    return true;
  }, []);

  const clearWarnings = useCallback(() => {
    setValidationWarnings([]);
  }, []);

  return {
    validationWarnings,
    checkExportQuality,
    clearWarnings,
  };
}
