'use client';

import { useState } from 'react';

interface PreviewButtonProps {
  pageKey: string;
  locale?: string;
  content: Record<string, any>;
  className?: string;
}

export default function PreviewButton({
  pageKey,
  locale = 'nl',
  content,
  className = '',
}: PreviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePreview() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageKey, locale, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Preview mislukt');
      }

      // Open preview in new tab
      window.open(data.previewUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview mislukt');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePreview}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 ${className}`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Preview laden...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview bekijken
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
