import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const role = request.cookies.get('fxpro_role')?.value;
  const authenticated = Boolean(role);
  const adminOnly = ['/admin/reports', '/admin/audit-logs', '/admin/settings', '/admin/administrators', '/admin/roles'];
  if (request.nextUrl.pathname.startsWith('/dashboard') && !authenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login' && !authenticated) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/admin') && role === 'USER') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (adminOnly.some((path) => request.nextUrl.pathname.startsWith(path)) && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
