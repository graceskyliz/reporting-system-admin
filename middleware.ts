import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  console.log('[Middleware] Request to:', pathname)

  // Allow auth routes and home without checking user
  if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/') {
    console.log('[Middleware] Public route, allowing access')
    return NextResponse.next()
  }

  const auth = request.cookies.get('auth')?.value
  console.log('[Middleware] Auth cookie exists:', !!auth)

  // For dashboard routes, verify authentication token exists
  if (pathname.startsWith('/dashboard')) {
    if (!auth) {
      // Redirect to login if no auth token
      console.log('[Middleware] No auth cookie, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Verify token is valid JSON
      const decoded = JSON.parse(decodeURIComponent(auth))
      console.log('[Middleware] Auth cookie valid:', decoded)
      return NextResponse.next()
    } catch (err) {
      // Invalid token format, redirect to login
      console.log('[Middleware] Invalid auth cookie, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/'],
}
