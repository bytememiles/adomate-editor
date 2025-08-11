import type { Stage } from 'konva/lib/Stage';
import type { Background } from '@/types';

/**
 * Export canvas to PNG with original pixel dimensions
 */
export interface ExportOptions {
  filename?: string;
  quality?: number;
  mimeType?: string;
}

/**
 * Export result with metadata
 */
export interface ExportResult {
  success: boolean;
  dataUrl?: string;
  filename: string;
  originalDimensions: { width: number; height: number };
  exportDimensions: { width: number; height: number };
  pixelRatio: number;
  fileSize?: number;
  error?: string;
}

/**
 * Calculate optimal pixel ratio for export
 */
export function calculatePixelRatio(originalWidth: number, displayWidth: number): number {
  // Clamp pixel ratio between 1 and 8 for optimal quality vs performance
  const ratio = originalWidth / displayWidth;
  return Math.max(1, Math.min(8, ratio));
}

/**
 * Export stage to PNG with original dimensions
 */
export async function exportStageToPng(
  stage: Stage,
  background: Background | null,
  options: ExportOptions = {},
): Promise<ExportResult> {
  try {
    const { filename = 'export.png', quality = 1.0, mimeType = 'image/png' } = options;

    // Get stage dimensions
    const stageWidth = stage.width();
    const stageHeight = stage.height();

    // Calculate pixel ratio based on background dimensions
    let pixelRatio = 1;
    let originalDimensions = { width: stageWidth, height: stageHeight };
    let exportDimensions = { width: stageWidth, height: stageHeight };

    if (background) {
      pixelRatio = calculatePixelRatio(background.originalWidth, background.displayWidth);
      originalDimensions = {
        width: background.originalWidth,
        height: background.originalHeight,
      };
      exportDimensions = {
        width: Math.round(stageWidth * pixelRatio),
        height: Math.round(stageHeight * pixelRatio),
      };
    }

    // Export with calculated pixel ratio
    const dataUrl = stage.toDataURL({
      pixelRatio,
      mimeType,
      quality,
      width: stageWidth,
      height: stageHeight,
    });

    // Calculate approximate file size (rough estimate)
    const base64Length = dataUrl.length;
    const fileSize = Math.round((base64Length * 3) / 4); // Base64 to bytes approximation

    return {
      success: true,
      dataUrl,
      filename,
      originalDimensions,
      exportDimensions,
      pixelRatio,
      fileSize,
    };
  } catch (error) {
    return {
      success: false,
      filename: options.filename || 'export.png',
      originalDimensions: { width: 0, height: 0 },
      exportDimensions: { width: 0, height: 0 },
      pixelRatio: 1,
      error: error instanceof Error ? error.message : 'Unknown export error',
    };
  }
}

/**
 * Trigger browser download of exported image
 */
export function downloadImage(dataUrl: string, filename: string): void {
  try {
    // Create temporary link element
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;

    // Append to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to trigger download:', error);
    throw new Error('Download failed');
  }
}

/**
 * Validate export dimensions and quality
 */
export function validateExport(
  originalDimensions: { width: number; height: number },
  exportDimensions: { width: number; height: number },
  pixelRatio: number,
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  let valid = true;

  // Check if export dimensions match original
  if (Math.abs(exportDimensions.width - originalDimensions.width) > 1) {
    warnings.push(
      `Export width (${exportDimensions.width}) doesn't match original (${originalDimensions.width})`,
    );
    valid = false;
  }

  if (Math.abs(exportDimensions.height - originalDimensions.height) > 1) {
    warnings.push(
      `Export height (${exportDimensions.height}) doesn't match original (${originalDimensions.height})`,
    );
    valid = false;
  }

  // Check pixel ratio bounds
  if (pixelRatio < 1 || pixelRatio > 8) {
    warnings.push(`Pixel ratio ${pixelRatio} is outside recommended bounds (1-8)`);
    valid = false;
  }

  // Check for very large exports
  const totalPixels = exportDimensions.width * exportDimensions.height;
  if (totalPixels > 100000000) {
    // 100MP limit
    warnings.push(
      `Export size (${Math.round(totalPixels / 1000000)}MP) may cause performance issues`,
    );
  }

  return { valid, warnings };
}
