import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Assuming text IDs (e.g., from Auth.js or UUIDs)
  name: text("name"),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

// Define projects table
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(), // Assuming text IDs
  name: text("name").notNull(),
  description: text("description"), // Nullable
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Foreign key + cascade delete
});

// Define tasks table
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(), // Assuming text IDs
  title: text("title").notNull(),
  description: text("description"), // Nullable
  status: text("status", { enum: ["To Do", "In Progress", "Done"] }).notNull(), // Use enum for status
  order: integer("order").notNull(), // For Kanban ordering
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }), // Foreign key + cascade delete
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  tasks: many(tasks), // Add relationship to tasks
}));

// Add relations for tasks
export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

// Remove the placeholder export if it exists
// export {}; 