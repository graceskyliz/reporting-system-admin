import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow auth routes and home without checking user
  if (pathname.startsWith('/login') || pathname === '/') {
    return NextResponse.next()
  }

  const auth = request.cookies.get('auth')?.value

  // For dashboard routes, verify authentication token exists
  if (pathname.startsWith('/dashboard')) {
    if (!auth) {
      // Redirect to login if no auth token
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Verify token is valid JSON
      JSON.parse(auth)
      return NextResponse.next()
    } catch (err) {
      // Invalid token format, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/'],
}
