export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop-only warning */}
      <div className="lg:hidden fixed inset-0 bg-primary-50 flex items-center justify-center p-8 z-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold text-primary-800 mb-4">
            Desktop Only
          </h1>
          <p className="text-primary-600">
            This application is designed for desktop use only. Please use a device with a minimum width of 1024px.
          </p>
        </div>
      </div>

      {/* Main content - only visible on desktop */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-primary-900 mb-4">
              Adomate Editor
            </h1>
            <p className="text-xl text-primary-600">
              A modern, desktop-focused editor built with Next.js 14 and Tailwind CSS
            </p>
          </header>

          <main className="space-y-8">
            {/* Project Status */}
            <section className="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
              <h2 className="text-2xl font-semibold text-primary-800 mb-4">
                Project Setup Complete
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-primary-700 mb-3">Dependencies</h3>
                  <ul className="space-y-2 text-sm text-primary-600">
                    <li>• Next.js 14 with App Router</li>
                    <li>• TypeScript & ESLint</li>
                    <li>• Redux Toolkit & React Redux</li>
                    <li>• Konva & React Konva</li>
                    <li>• Tailwind CSS v4</li>
                    <li>• Zod for validation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary-700 mb-3">Features</h3>
                  <ul className="space-y-2 text-sm text-primary-600">
                    <li>• Desktop-only responsive design</li>
                    <li>• Soft gray color palette</li>
                    <li>• Modern UI components</li>
                    <li>• Type-safe development</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
              <h2 className="text-2xl font-semibold text-primary-800 mb-4">
                Quick Actions
              </h2>
              <div className="flex gap-4">
                <button className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start Development
                </button>
                <button className="bg-primary-100 hover:bg-primary-200 text-primary-700 px-6 py-3 rounded-lg font-medium transition-colors border border-primary-300">
                  View Documentation
                </button>
              </div>
            </section>

            {/* Color Palette Demo */}
            <section className="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
              <h2 className="text-2xl font-semibold text-primary-800 mb-4">
                Color Palette
              </h2>
              <div className="grid grid-cols-5 gap-4">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div key={shade} className="text-center">
                    <div 
                      className={`w-16 h-16 rounded-lg border border-primary-200 mx-auto mb-2 bg-primary-${shade}`}
                    ></div>
                    <span className="text-xs text-primary-600">primary-{shade}</span>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
