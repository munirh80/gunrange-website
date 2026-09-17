import React from 'react';

export default function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-[#46586b] border-t-transparent"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
