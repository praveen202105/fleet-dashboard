import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user is trying to access protected routes
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get("JSESSIONID")

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect from login to dashboard if already authenticated
  if (pathname === "/login") {
    const sessionCookie = request.cookies.get("JSESSIONID")

    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
