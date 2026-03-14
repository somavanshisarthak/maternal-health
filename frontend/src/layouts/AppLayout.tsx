import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AppLayout
 * A standard layout wrapper for non-dashboard pages (like Login, or Patient Surveys).
 * Ensures correct spacing and centers main content.
 */
export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 selection:bg-teal-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
