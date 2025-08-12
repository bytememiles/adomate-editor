'use client';

export default function DesktopWarning() {
  return (
    <div className='lg:hidden fixed inset-0 bg-grey-100 flex items-center justify-center p-8 z-50'>
      <div className='text-center max-w-md'>
        <h1 className='text-2xl font-semibold text-text-primary mb-4'>Desktop Only</h1>
        <p className='text-text-secondary'>
          This application is designed for desktop use only. Please use a device with a minimum
          width of 1024px.
        </p>
      </div>
    </div>
  );
}
