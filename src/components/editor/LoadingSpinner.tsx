'use client';

export default function LoadingSpinner() {
  return (
    <div className='min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-8 h-8 border-2 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-text-secondary'>Loading editor...</p>
      </div>
    </div>
  );
}
