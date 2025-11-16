import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow auth routes without checking user
  if (pathname.startsWith('/login') || pathname === '/') {
    return NextResponse.next()
  }

  // For dashboard routes, you would check authentication here
  // This is simplified - in production, validate JWT tokens

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/'],
}
