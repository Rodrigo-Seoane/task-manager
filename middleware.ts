/**
 * Next.js Middleware
 * Route protection and authentication checks
 *
 * Simplified version without NextAuth wrapper to avoid Edge runtime issues
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get session token from cookies
  const sessionToken = req.cookies.get("authjs.session-token")?.value ||
                       req.cookies.get("__Secure-authjs.session-token")?.value;

  const isAuthenticated = !!sessionToken;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/tutor/login",
    "/tutor/signup",
    "/learner/select",
    "/learner/pin",
    "/styleguide",
    "/api/",
  ];

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Allow access to public routes and API routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated (for protected routes)
  if (!isAuthenticated) {
    if (pathname.startsWith("/tutor/")) {
      const loginUrl = new URL("/tutor/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith("/learner/")) {
      const selectUrl = new URL("/learner/select", req.url);
      return NextResponse.redirect(selectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
