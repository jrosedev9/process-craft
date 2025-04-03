import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "./lib/db"; // Database import is ONLY needed here now
import { users } from "./lib/db/schema";
import { authConfig } from "./auth.config"; // Import the base config

// Remove the verification log
// console.log("[auth.ts] AUTH_SECRET:", process.env.AUTH_SECRET);

// Remove unused DbUser type
// type DbUser = typeof users.$inferSelect;

// Define a base configuration to satisfy NextAuthConfig type checking
// This prevents needing to cast or assert types later
// export const authConfig = {
//   // adapter: DrizzleAdapter(db, {
//   //   usersTable: users,
//   //   accountsTable: accounts,
//   //   sessionsTable: sessions,
//   //   verificationTokensTable: verificationTokens,
//   // }), // If using Database sessions/accounts
//   providers: [
//     Credentials({
//       // No need for name/credentials here if using a custom login form
//       async authorize(credentials) {
//         // Basic validation (consider Zod)
//         if (
//           !credentials?.email ||
//           !credentials?.password ||
//           typeof credentials.email !== "string" ||
//           typeof credentials.password !== "string"
//         ) {
//           console.error("Auth Error: Invalid credentials format");
//           return null;
//         }
//
//         try {
//           const user = await db.query.users.findFirst({
//             where: eq(users.email, credentials.email),
//           });
//
//           if (!user || !user.hashedPassword) {
//             console.log(
//               `Auth Attempt Failed: User not found or no password for ${credentials.email}`
//             );
//             return null;
//           }
//
//           const passwordsMatch = await bcrypt.compare(
//             credentials.password,
//             user.hashedPassword
//           );
//
//           if (passwordsMatch) {
//             console.log(`Auth Success: User ${user.email} authenticated`);
//             // Create a copy and manually delete the password
//             const userWithoutPassword = { ...user };
//             delete (userWithoutPassword as Partial<typeof user>).hashedPassword;
//             return userWithoutPassword;
//           }
//
//           console.log(
//             `Auth Attempt Failed: Incorrect password for ${credentials.email}`
//           );
//           return null;
//         } catch (error) {
//           console.error("Authorization Error:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login", // Redirect to /login if authentication is required
//   },
//   session: {
//     strategy: "jwt", // Use JSON Web Tokens for session management
//   },
//   callbacks: {
//     // The jwt callback is invoked **before** the session callback.
//     // It receives the user object from the authorize function on initial sign-in.
//     async jwt({ token, user }) {
//       // On successful sign-in (user object exists), add the user ID to the token.
//       if (user?.id) {
//         token.id = user.id;
//         // You could add other properties like role here if needed
//         // token.role = user.role;
//       }
//       return token; // The token is then passed to the session callback.
//     },
//
//     // The session callback is invoked **after** the jwt callback.
//     // It receives the token from the jwt callback.
//     async session({ session, token }) {
//       // If the token has an ID (added in the jwt callback), add it to the session user object.
//       if (token?.id && session.user) {
//         session.user.id = token.id as string; // Add user ID to the session
//         // You could add other properties from the token here if needed
//         // session.user.role = token.role as string;
//       }
//       return session; // The session object is then available via auth() or useSession().
//     },
//   },
//   // trustHost: true, // Required for Vercel deployment according to docs, consider adding if deploying
//   // secret: process.env.AUTH_SECRET, // Auth.js v5 usually infers this, but explicitly setting can help debugging
// } satisfies NextAuthConfig; // Use 'satisfies' for type checking without casting

// This is the main config used for handlers, signin, signout
// It includes Node.js dependent providers
export const {
  handlers: { GET, POST },
  // 'auth' is NOT exported here, middleware uses the base config
  signIn,
  signOut,
  // We re-export 'auth' derived ONLY from the base config for server-side use outside middleware
  // This avoids pulling providers into server components unnecessarily if only session check is needed
  // auth: baseAuth // Optional re-export if needed elsewhere - check usage
} = NextAuth({
  ...authConfig, // Spread the base config
  providers: [
    // Add providers that depend on Node.js APIs here
    Credentials({
      async authorize(credentials) {
        // Basic validation (consider Zod)
        if (
          !credentials?.email ||
          !credentials?.password ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          console.error("Auth Error: Invalid credentials format");
          return null;
        }

        try {
          // Database access is safe here (runs on Node.js runtime)
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email),
          });

          if (!user || !user.hashedPassword) {
            console.log(
              `Auth Attempt Failed: User not found or no password for ${credentials.email}`
            );
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (passwordsMatch) {
            console.log(`Auth Success: User ${user.email} authenticated`);
            const userWithoutPassword = { ...user };
            delete (userWithoutPassword as Partial<typeof user>).hashedPassword;
            return userWithoutPassword;
          }

          console.log(
            `Auth Attempt Failed: Incorrect password for ${credentials.email}`
          );
          return null;
        } catch (error) {
          console.error("Authorization Error:", error);
          return null;
        }
      },
    }),
    // Add other providers like Google, GitHub etc. here if needed
  ],
});

// Explicitly export auth derived from base config for server components/actions if needed
// This avoids potentially pulling the Credentials provider logic into every server component
// that just needs to check the session.
export const { auth } = NextAuth(authConfig);
