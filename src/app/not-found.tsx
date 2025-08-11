'use client';

import Link from 'next/link';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-warning-main rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-warning-contrastText"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
            />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">
            Page not found
          </h1>
          <p className="text-text-secondary">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary-main text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Go home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-grey-200 text-text-primary rounded-lg font-medium hover:bg-grey-300 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
