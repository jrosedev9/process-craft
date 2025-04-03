import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10; // Standard salt rounds, adjust if needed

/**
 * Hashes a plain text password using bcrypt.
 * @param password The plain text password to hash.
 * @returns A promise that resolves with the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password cannot be empty");
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
} 