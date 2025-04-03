"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { registerSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/hash";
import { signIn, signOut } from "@/auth";
import { AuthError } from "@auth/core/errors";

// Define a return type for better type checking with useActionState
export type RegisterState = {
  status: "success" | "error";
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  } | null;
} | null;

export async function registerUser(
  prevState: RegisterState, 
  formData: FormData
): Promise<RegisterState> {
  // 1. Validate form data
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid input. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // 2. Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return {
        status: "error",
        message: "Registration failed.",
        errors: { email: ["An account with this email already exists."] },
      };
    }

    // 3. Hash the password
    const hashedPassword = await hashPassword(password);

    // 4. Generate user ID
    const userId = uuidv4();

    // 5. Create the user in the database
    await db.insert(users).values({
      id: userId,
      name,
      email,
      hashedPassword,
    });

    // 6. Return success state
    // Note: We don't automatically sign the user in here.
    // That usually happens after verification or on the login page.
    return {
      status: "success",
      message:
        "Registration successful! Please check your email for verification (if applicable) or log in.",
      errors: null,
    };
  } catch (error) {
    console.error("Registration Error:", error);
    // Generic error for unexpected issues
    return {
      status: "error",
      message:
        "An unexpected error occurred during registration. Please try again.",
      errors: { _form: ["An internal error occurred."] },
    };
  }
}

export async function login(prevState: string | undefined, formData: FormData) {
  try {
    console.log("Attempting login via server action...");
    await signIn("credentials", formData);
    // Successful sign-in will redirect by default if not handled otherwise.
    // If signIn throws an error, it's caught below.
    // If using redirect: false, handle success state return here.
    return undefined; // Indicate success when no redirect happens within signIn
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.error("Login Action Error: Invalid credentials");
          return "Invalid email or password.";
        default:
          console.error("Login Action Error:", error.type);
          return "Something went wrong. Please try again.";
      }
    }
    // Rethrow if it's not an AuthError, indicating an unexpected server error
    console.error("Unexpected Login Action Error:", error);
    throw error;
  }
}

// New Logout Action
export async function logoutAction() {
  // No need for validation or DB access, just call signOut
  try {
    await signOut({ redirectTo: "/login" });
  } catch (error) {
    // Although signOut doesn't typically throw errors that need client handling,
    // logging server-side errors is good practice.
    console.error("SignOut Error:", error);
    // Potentially re-throw or handle differently if specific errors can occur
    throw error; // Re-throwing keeps the default Next.js error handling
  }
}
