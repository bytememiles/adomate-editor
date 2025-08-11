export interface DisplayFit {
  displayWidth: number;
  displayHeight: number;
  scale: number;
}

/**
 * Compute display dimensions to fit within viewport or cap
 */
export function computeDisplayFit(
  originalWidth: number,
  originalHeight: number,
  viewportWidth: number = 1600,
  viewportHeight: number = 900,
): DisplayFit {
  // Cap dimensions
  const maxWidth = Math.min(viewportWidth, 1600);
  const maxHeight = Math.min(viewportHeight, 900);

  // Calculate scale to fit (contain)
  const scaleX = maxWidth / originalWidth;
  const scaleY = maxHeight / originalHeight;
  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond original

  // Calculate display dimensions
  const displayWidth = Math.round(originalWidth * scale);
  const displayHeight = Math.round(originalHeight * scale);

  return {
    displayWidth,
    displayHeight,
    scale,
  };
}

/**
 * Compute display fit for current viewport
 */
export function computeViewportFit(originalWidth: number, originalHeight: number): DisplayFit {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return computeDisplayFit(originalWidth, originalHeight);
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return computeDisplayFit(originalWidth, originalHeight, viewportWidth, viewportHeight);
}

/**
 * Check if dimensions need scaling
 */
export function needsScaling(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number = 1600,
  maxHeight: number = 900,
): boolean {
  return originalWidth > maxWidth || originalHeight > maxHeight;
}
