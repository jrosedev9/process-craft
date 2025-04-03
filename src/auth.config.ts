import type { NextAuthConfig } from "next-auth";

// This configuration is safe for the Edge runtime
// It EXCLUDES providers or adapters that rely on Node.js APIs.
export const authConfig = {
  pages: {
    signIn: "/login", // Redirect to /login if authentication is required
  },
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session management
  },
  callbacks: {
    // The jwt callback runs even in the middleware context (for checks)
    // It receives the token potentially enriched by the authorize function after login.
    async jwt({ token, user }) {
      // On successful sign-in (user object exists), add the user ID to the token.
      if (user?.id) {
        token.id = user.id;
        // You could add other properties like role here if needed
        // token.role = user.role;
      }
      return token; // The token is then passed to the session callback and available to middleware checks.
    },

    // The session callback runs on the server when session data is accessed.
    async session({ session, token }) {
      // If the token has an ID (added in the jwt callback), add it to the session user object.
      if (token?.id && session.user) {
        session.user.id = token.id as string; // Add user ID to the session
        // You could add other properties from the token here if needed
        // session.user.role = token.role as string;
      }
      return session; // The session object is then available via auth() or useSession().
    },
    // Add authorized callback for middleware route protection
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/projects'); // Adjust paths as needed
      const isOnAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

      if (isOnDashboard) {
        if (isLoggedIn) return true; // Allow access if logged in
        return false; // Redirect unauthenticated users to login
      } else if (isOnAuthRoute) {
        if (isLoggedIn) {
          // Redirect logged-in users away from auth pages to the dashboard
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true; // Allow access if not logged in
      }
      // Allow other routes (e.g., public landing page at '/') by default
      // Add more specific checks if needed
      return true;
    },
  },
  providers: [], // Providers are added in the main src/auth.ts file
  // trustHost: true, // Consider uncommenting if deploying to Vercel
  // secret: process.env.AUTH_SECRET, // Usually inferred
} satisfies NextAuthConfig; 