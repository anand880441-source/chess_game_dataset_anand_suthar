import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Chess Match Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Frontend Setup Complete! 🎉
          </p>
        </div>

        {/* Color Palette Test */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Tailwind CSS v4 & MUI Integration
          </h2>
          <div className="flex gap-4 flex-wrap">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
          </div>
        </div>

        {/* Form Input Test */}
        <div className="card">
          <label className="label">Test Input</label>
          <input type="text" className="input" placeholder="Type something..." />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            ✅ Tailwind CSS v4 is working! Dark mode is ready.
          </p>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Frontend Ready for Development
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;