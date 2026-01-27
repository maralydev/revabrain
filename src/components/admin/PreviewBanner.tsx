'use client';

import { useState } from 'react';

interface PreviewBannerProps {
  pageKey: string;
}

export default function PreviewBanner({ pageKey }: PreviewBannerProps) {
  const [isExiting, setIsExiting] = useState(false);

  async function exitPreview() {
    setIsExiting(true);
    try {
      await fetch('/api/preview', { method: 'DELETE' });
      // Reload without preview param
      window.location.href = `/${pageKey}`;
    } catch {
      setIsExiting(false);
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500 text-yellow-900 py-2 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">
            Preview modus - Dit is een voorbeeld van uw wijzigingen
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`/admin/settings/content?page=${pageKey}`}
            className="text-sm font-medium hover:underline"
          >
            Terug naar bewerken
          </a>
          <button
            onClick={exitPreview}
            disabled={isExiting}
            className="px-3 py-1 bg-yellow-900 text-yellow-100 text-sm font-medium rounded hover:bg-yellow-800 transition-colors disabled:opacity-50"
          >
            {isExiting ? 'Sluiten...' : 'Preview sluiten'}
          </button>
        </div>
      </div>
    </div>
  );
}
