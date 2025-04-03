import type { Config } from "drizzle-kit";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Helper function to extract path from DATABASE_URL
const getDbPath = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl?.startsWith("sqlite:")) {
    return dbUrl.substring("sqlite:".length);
  }
  // Default or handle other cases if necessary
  return "sqlite.db"; // Fallback, though should be set by dotenv
};

export default {
  dialect: "sqlite",
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dbCredentials: {
    url: getDbPath(), // Use the helper function
  },
  verbose: true,
  strict: true,
} satisfies Config; 