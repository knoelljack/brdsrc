import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    // Allow the request to continue for authenticated users
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Define protected routes that require authentication
        const protectedRoutes = [
          '/profile',
          '/my-listings',
          '/favorites',
          '/sell',
          '/edit-listing',
        ];

        // Check if current path requires authentication
        const isProtectedRoute = protectedRoutes.some(route =>
          pathname.startsWith(route)
        );

        // If it's a protected route and user is not authenticated
        if (isProtectedRoute && !token) {
          return false; // This will trigger redirect to signin
        }

        // Allow access to all other routes
        return true;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    '/profile/:path*',
    '/my-listings/:path*',
    '/favorites/:path*',
    '/sell/:path*',
    '/edit-listing/:path*',
  ],
};
