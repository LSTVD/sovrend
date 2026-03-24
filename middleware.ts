import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  const devAccess = request.cookies.get('devAccess')?.value

  if (!isDevMode) return NextResponse.next()
  if (devAccess === process.env.NEXT_PUBLIC_LAUNCH_PW) return NextResponse.next()
  if (request.nextUrl.pathname === '/dev-gate') return NextResponse.next()

  return NextResponse.redirect(new URL('/dev-gate', request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
