import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/shared/lib/auth';

// Enable preview mode for a specific page
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
    }

    const session = await verifySession(sessionToken);
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: 'Admin toegang vereist' }, { status: 403 });
    }

    const { pageKey, locale = 'nl', content } = await request.json();

    if (!pageKey || !content) {
      return NextResponse.json({ error: 'pageKey en content zijn verplicht' }, { status: 400 });
    }

    // Store preview data in a cookie (expires in 1 hour)
    const previewData = {
      pageKey,
      locale,
      content,
      timestamp: Date.now(),
    };

    const response = NextResponse.json({
      success: true,
      previewUrl: `/${pageKey}?preview=true`,
    });

    // Set preview cookie
    response.cookies.set('preview_data', JSON.stringify(previewData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    );
  }
}

// Clear preview mode
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('preview_data');
  return response;
}

// Get current preview data
export async function GET() {
  try {
    const cookieStore = await cookies();
    const previewCookie = cookieStore.get('preview_data')?.value;

    if (!previewCookie) {
      return NextResponse.json({ preview: null });
    }

    const previewData = JSON.parse(previewCookie);

    // Check if preview has expired (older than 1 hour)
    if (Date.now() - previewData.timestamp > 3600000) {
      const response = NextResponse.json({ preview: null, expired: true });
      response.cookies.delete('preview_data');
      return response;
    }

    return NextResponse.json({ preview: previewData });
  } catch {
    return NextResponse.json({ preview: null });
  }
}
