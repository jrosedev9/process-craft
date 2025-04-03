import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { type InferSelectModel } from 'drizzle-orm';

import { db } from "./lib/db";
import { users } from "./lib/db/schema";
import { eq } from "drizzle-orm";
// import type { User } from "./lib/db/schema"; // Assuming User type is exported

// Infer the user type from the Drizzle schema, excluding the password
type UserSchema = typeof users;
type DbUser = InferSelectModel<UserSchema>;
type AuthUser = Omit<DbUser, 'hashedPassword'>;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign-in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      // Use the inferred AuthUser type for the return promise
      async authorize(credentials): Promise<AuthUser | null> {
        // Validate credentials structure (basic check, Zod validation can be added)
        if (!credentials?.email || !credentials?.password) {
            console.error("Auth Error: Missing credentials");
            return null;
        }
        if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
            console.error("Auth Error: Invalid credential types");
            return null;
        }

        try {
          // Find user by email using Drizzle
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email),
          });

          if (!user || !user.hashedPassword) {
            console.log(`Auth Attempt Failed: User not found or no password for ${credentials.email}`);
            return null; // User not found or doesn't have a password set
          }

          // Compare provided password with the stored hashed password
          const passwordsMatch = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (passwordsMatch) {
            console.log(`Auth Success: User ${user.email} authenticated`);
            // Create a copy and remove the password property to satisfy the linter
            const userWithoutPassword = { ...user };
            delete (userWithoutPassword as Partial<DbUser>).hashedPassword; // Type assertion needed for delete
            return userWithoutPassword as AuthUser; // Ensure correct return type
          } else {
             console.log(`Auth Attempt Failed: Incorrect password for ${credentials.email}`);
            return null; // Passwords do not match
          }
        } catch (error) {
          console.error("Authorization Error:", error);
          // Throwing an error or returning null can be handled differently based on desired UX
          // Returning null is generally safer to prevent leaking information
          return null;
        }
      },
    }),
  ],
  // Add other NextAuth options here if needed (e.g., pages, session, callbacks)
  // pages: {
  //   signIn: '/login', // Redirect users to /login if they need to sign in
  // },
  // session: {
  //   strategy: "jwt", // Or "database"
  // },
  // callbacks: {
  //   // Add callbacks here if you need to modify the session or JWT token
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id; // Add user ID to the JWT token
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token && session.user) {
  //       session.user.id = token.id as string; // Add user ID to the session object
  //     }
  //     return session;
  //   },
  // }
}); 