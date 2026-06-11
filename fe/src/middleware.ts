import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Chỉ định các route middleware sẽ chạy
export const config = {
  matcher: ['/admin/:path*'],
};
