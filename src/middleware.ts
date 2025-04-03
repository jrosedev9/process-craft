// src/middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config"; // Import the EDGE-COMPATIBLE config

// Instantiate NextAuth using ONLY the edge-compatible config
// The 'authorized' callback within authConfig handles the logic.
export default NextAuth(authConfig).auth;

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 