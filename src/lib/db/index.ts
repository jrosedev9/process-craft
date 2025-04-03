import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Use a persistent file in development, or :memory: for tests/other environments
const sqlite = new Database(process.env.DATABASE_URL ?? "sqlite.db");

// Enable WAL mode for better performance and concurrency
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
