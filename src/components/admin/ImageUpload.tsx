'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  helpText?: string;
  maxSize?: number; // in MB
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'free';
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'general',
  label = 'Afbeelding',
  helpText,
  maxSize = 5,
  aspectRatio = 'free',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Alleen JPG, PNG, GIF en WebP zijn toegestaan');
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Bestand te groot. Maximum is ${maxSize}MB`);
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload mislukt');
        }

        onChange(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload mislukt');
      } finally {
        setIsUploading(false);
      }
    },
    [folder, maxSize, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      // Reset input so the same file can be selected again
      e.target.value = '';
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onChange('');
  }, [onChange]);

  // Aspect ratio classes
  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-video',
    free: 'min-h-[200px]',
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {value ? (
        // Preview existing image
        <div className="relative group">
          <div
            className={`relative ${aspectClasses[aspectRatio]} overflow-hidden rounded-lg border border-gray-200 bg-gray-50`}
          >
            <Image
              src={value}
              alt="Geüploade afbeelding"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Wijzig
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Verwijder
            </button>
          </div>
        </div>
      ) : (
        // Upload zone
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative ${aspectClasses[aspectRatio]} min-h-[150px]
            border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center
            cursor-pointer transition-colors
            ${isDragging ? 'border-[var(--rb-primary)] bg-[var(--rb-light)]' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading ? 'pointer-events-none opacity-60' : ''}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Uploaden...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-[var(--rb-primary)]">
                  Klik om te uploaden
                </span>{' '}
                of sleep een bestand hierheen
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF of WebP (max {maxSize}MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* URL input for manual entry */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Of voer een URL in..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-transparent"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Help text */}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
