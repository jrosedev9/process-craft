import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  // Add password complexity requirements if desired
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

// Define the type inferred from the schema for use in the action
export type RegisterInput = z.infer<typeof registerSchema>; 