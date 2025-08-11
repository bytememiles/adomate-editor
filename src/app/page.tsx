import EditorControls from '@/components/EditorControls';
import FontSelector from '@/components/FontSelector';
import ExportControls from '@/components/ExportControls';
import EditorBehaviorDemo from '@/components/EditorBehaviorDemo';

const Home = (): React.JSX.Element => {
  return (
    <div className='min-h-screen bg-neutral-50 text-neutral-900'>
      {/* Desktop-only warning */}
      <div className='lg:hidden fixed inset-0 bg-grey-100 flex items-center justify-center p-8 z-50'>
        <div className='text-center max-w-md'>
          <h1 className='text-2xl font-semibold text-text-primary mb-4'>Desktop Only</h1>
          <p className='text-text-secondary'>
            This application is designed for desktop use only. Please use a device with a minimum
            width of 1024px.
          </p>
        </div>
      </div>

      {/* Main content - only visible on desktop */}
      <div className='hidden lg:block'>
        <div className='max-w-7xl mx-auto px-8 py-12'>
          <header className='mb-12'>
            <h1 className='text-4xl font-bold text-text-primary mb-4'>Adomate Editor</h1>
            <p className='text-xl text-text-secondary'>
              A modern, desktop-focused editor built with Next.js 15 and Tailwind CSS
            </p>
          </header>

          <main className='space-y-8'>
            {/* Editor Controls */}
            <EditorControls />

            {/* Font Selector */}
            <FontSelector />

            {/* Export Controls */}
            <ExportControls />

            {/* Editor Behavior Demo */}
            <EditorBehaviorDemo />

            {/* Project Status */}
            <section className='bg-white rounded-lg shadow-sm border border-grey-300 p-6'>
              <h2 className='text-2xl font-semibold text-text-primary mb-4'>
                Project Setup Complete
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-medium text-text-primary mb-3'>Dependencies</h3>
                  <ul className='space-y-2 text-sm text-text-secondary'>
                    <li>• Next.js 15 with App Router</li>
                    <li>• TypeScript & ESLint</li>
                    <li>• Redux Toolkit & React Redux</li>
                    <li>• Konva & React Konva</li>
                    <li>• Tailwind CSS v3 with custom color system</li>
                    <li>• Zod for validation</li>
                  </ul>
                </div>
                <div>
                  <h3 className='text-lg font-medium text-text-primary mb-3'>Features</h3>
                  <ul className='space-y-2 text-sm text-text-secondary'>
                    <li>• Desktop-only responsive design</li>
                    <li>• Soft gray color palette</li>
                    <li>• Modern UI components</li>
                    <li>• Type-safe development</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className='bg-white rounded-lg shadow-sm border border-grey-300 p-6'>
              <h2 className='text-2xl font-semibold text-text-primary mb-4'>Quick Actions</h2>
              <div className='flex gap-4'>
                <button className='bg-secondary-main hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors'>
                  Start Development
                </button>
                <button className='bg-primary-light hover:bg-primary-main text-white px-6 py-3 rounded-lg font-medium transition-colors border border-primary-main'>
                  View Documentation
                </button>
              </div>
            </section>

            {/* Color Palette Demo */}
            <section className='bg-white rounded-lg shadow-sm border border-grey-300 p-6'>
              <h2 className='text-2xl font-semibold text-text-primary mb-4'>Color Palette</h2>

              {/* Grey Scale */}
              <div className='mb-8'>
                <h3 className='text-lg font-medium text-text-primary mb-4'>Grey Scale</h3>
                <div className='grid grid-cols-5 gap-4'>
                  {[
                    { shade: 0, class: 'bg-grey-0' },
                    { shade: 100, class: 'bg-grey-100' },
                    { shade: 200, class: 'bg-grey-200' },
                    { shade: 300, class: 'bg-grey-300' },
                    { shade: 400, class: 'bg-grey-400' },
                    { shade: 500, class: 'bg-grey-500' },
                    { shade: 600, class: 'bg-grey-600' },
                    { shade: 700, class: 'bg-grey-700' },
                    { shade: 800, class: 'bg-grey-800' },
                    { shade: 900, class: 'bg-grey-900' },
                  ].map(({ shade, class: className }) => (
                    <div key={shade} className='text-center'>
                      <div
                        className={`w-16 h-16 rounded-lg border border-grey-300 mx-auto mb-2 ${className}`}
                      ></div>
                      <span className='text-xs text-text-secondary'>grey-{shade}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Colors */}
              <div>
                <h3 className='text-lg font-medium text-text-primary mb-4'>Semantic Colors</h3>
                <div className='grid grid-cols-5 gap-4'>
                  {[
                    { name: 'Primary', class: 'bg-primary-main', text: 'text-white' },
                    { name: 'Secondary', class: 'bg-secondary-main', text: 'text-white' },
                    { name: 'Success', class: 'bg-success-main', text: 'text-white' },
                    {
                      name: 'Warning',
                      class: 'bg-warning-main',
                      text: 'text-warning-contrastText',
                    },
                    { name: 'Error', class: 'bg-error-main', text: 'text-white' },
                    { name: 'Info', class: 'bg-info-main', text: 'text-white' },
                  ].map(({ name, class: className, text }) => (
                    <div key={name} className='text-center'>
                      <div
                        className={`w-16 h-16 rounded-lg border border-grey-300 mx-auto mb-2 ${className} flex items-center justify-center`}
                      >
                        <span className={`text-xs font-medium ${text}`}>{name}</span>
                      </div>
                      <span className='text-xs text-text-secondary'>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
