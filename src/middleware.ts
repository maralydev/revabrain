import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/shared/lib/auth';

// Public routes die geen auth vereisen
const PUBLIC_ROUTES = ['/login', '/'];

// Admin-only routes
const ADMIN_ROUTES = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check of route public is
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Haal sessie op via cookie
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check admin routes
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute && !session.isAdmin) {
    return NextResponse.redirect(new URL('/agenda', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
