// Storage configuration constants
export const STORAGE_KEYS = {
  UPLOADED_FILES: 'adomate-uploaded-files',
} as const;

export const STORAGE_LIMITS = {
  MAX_FILES: Number(process.env['NEXT_PUBLIC_MAX_FILES']) || 10,
  MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
} as const;

// Storage warning thresholds
export const STORAGE_WARNING_THRESHOLDS = {
  WARNING: 80, // Show warning at 80% usage
  CRITICAL: 90, // Show critical warning at 90% usage
} as const;
