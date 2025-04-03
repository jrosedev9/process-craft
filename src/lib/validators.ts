import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  // Add password complexity requirements if desired
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

// Define the type inferred from the schema for use in the action
export type RegisterInput = z.infer<typeof registerSchema>;

// Project validation schemas
export const projectCreateSchema = z.object({
  name: z.string().min(2, { message: "Project name must be at least 2 characters long" }).max(100, { message: "Project name must be less than 100 characters" }),
  description: z.string().optional(),
});

export const projectUpdateSchema = projectCreateSchema.partial();

// Define the types inferred from the schemas for use in actions
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

// Task validation schemas
export const taskStatusEnum = z.enum(["To Do", "In Progress", "Done"]);

export const taskCreateSchema = z.object({
  title: z.string().min(1, { message: "Task title is required" }).max(100, { message: "Task title must be less than 100 characters" }),
  description: z.string().optional(),
  projectId: z.string().min(1, { message: "Project ID is required" }),
  status: taskStatusEnum.default("To Do"),
  order: z.number().int().default(0),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(1, { message: "Task title is required" }).max(100, { message: "Task title must be less than 100 characters" }).optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
});

export const taskStatusUpdateSchema = z.object({
  status: taskStatusEnum,
  order: z.number().int(),
});

// Define the types inferred from the schemas for use in actions
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
export type TaskStatusUpdateInput = z.infer<typeof taskStatusUpdateSchema>;