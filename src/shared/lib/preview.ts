import { cookies } from 'next/headers';

interface PreviewData {
  pageKey: string;
  locale: string;
  content: Record<string, any>;
  timestamp: number;
}

/**
 * Get preview data for a specific page (server-side only)
 * Returns null if not in preview mode or preview is for a different page
 */
export async function getPreviewData(pageKey: string): Promise<PreviewData | null> {
  try {
    const cookieStore = await cookies();
    const previewCookie = cookieStore.get('preview_data')?.value;

    if (!previewCookie) {
      return null;
    }

    const previewData: PreviewData = JSON.parse(previewCookie);

    // Check if this preview is for the requested page
    if (previewData.pageKey !== pageKey) {
      return null;
    }

    // Check if preview has expired (older than 1 hour)
    if (Date.now() - previewData.timestamp > 3600000) {
      return null;
    }

    return previewData;
  } catch {
    return null;
  }
}

/**
 * Check if the current request is in preview mode
 */
export async function isPreviewMode(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const previewCookie = cookieStore.get('preview_data')?.value;
    return !!previewCookie;
  } catch {
    return false;
  }
}

/**
 * Merge preview content with database content
 * Preview content takes precedence
 */
export function mergeWithPreview(
  dbContent: Record<string, any> | null,
  previewContent: Record<string, any> | null
): Record<string, any> {
  if (!previewContent) {
    return dbContent || {};
  }

  if (!dbContent) {
    return previewContent;
  }

  // Deep merge, preview takes precedence
  return {
    ...dbContent,
    ...previewContent,
  };
}
