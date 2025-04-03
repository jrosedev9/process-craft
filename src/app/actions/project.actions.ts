"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { projectCreateSchema, projectUpdateSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

// Type for the return value of project actions
export type ProjectActionState = {
  status: "success" | "error";
  message: string;
  data?: unknown;
  errors?: Record<string, string[]> | null;
} | null;

/**
 * Create a new project
 * @param prevState Previous state from useActionState
 * @param formData Form data containing project details
 * @returns ProjectActionState with status and data/errors
 */
export async function createProject(
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "You must be logged in to create a project.",
      errors: { _form: ["Unauthorized access."] },
    };
  }

  // 2. Validate input data
  const validatedFields = projectCreateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid project data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description } = validatedFields.data;

  try {
    // 3. Insert project into database
    const projectId = uuidv4();
    const [newProject] = await db
      .insert(projects)
      .values({
        id: projectId,
        name,
        description: description || null, // Handle optional description
        userId: session.user.id,
      })
      .returning();

    // 4. Revalidate projects page to update cache
    revalidatePath("/projects");

    // 5. Return success with the new project data
    return {
      status: "success",
      message: "Project created successfully.",
      data: newProject,
    };
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      status: "error",
      message: "Failed to create project. Please try again.",
      errors: { _form: ["Database error occurred."] },
    };
  }
}

/**
 * Get all projects for the current user
 * @returns Array of projects or null if not authenticated
 */
export async function getProjects() {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    // 2. Fetch projects for the current user
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.userId, session.user.id),
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });

    return userProjects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return null;
  }
}

/**
 * Get a single project by ID with its tasks
 * @param projectId ID of the project to fetch
 * @returns Project with tasks or null if not found or not authorized
 */
export async function getProjectById(projectId: string) {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    // 2. Fetch the project with authorization check
    const project = await db.query.projects.findFirst({
      where: (projects, { and, eq }) =>
        and(eq(projects.id, projectId), eq(projects.userId, session.user.id)),
      with: {
        tasks: {
          orderBy: (tasks, { asc }) => [asc(tasks.order)],
        },
      },
    });

    if (!project) {
      return null; // Project not found or user doesn't have access
    }

    return project;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

/**
 * Update an existing project
 * @param projectId ID of the project to update
 * @param data Project data to update
 * @returns ProjectActionState with status and data/errors
 */
export async function updateProject(
  projectId: string,
  data: FormData
): Promise<ProjectActionState> {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "You must be logged in to update a project.",
      errors: { _form: ["Unauthorized access."] },
    };
  }

  // 2. Validate input data
  const validatedFields = projectUpdateSchema.safeParse({
    name: data.get("name"),
    description: data.get("description"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid project data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // 3. Check if project exists and belongs to the user
    const existingProject = await db.query.projects.findFirst({
      where: (projects, { and, eq }) =>
        and(eq(projects.id, projectId), eq(projects.userId, session.user.id)),
    });

    if (!existingProject) {
      return {
        status: "error",
        message: "Project not found or you don't have permission to update it.",
        errors: { _form: ["Project not found."] },
      };
    }

    // 4. Update the project
    const [updatedProject] = await db
      .update(projects)
      .set(validatedFields.data)
      .where(eq(projects.id, projectId))
      .returning();

    // 5. Revalidate project pages to update cache
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);

    // 6. Return success with the updated project data
    return {
      status: "success",
      message: "Project updated successfully.",
      data: updatedProject,
    };
  } catch (error) {
    console.error("Failed to update project:", error);
    return {
      status: "error",
      message: "Failed to update project. Please try again.",
      errors: { _form: ["Database error occurred."] },
    };
  }
}

/**
 * Delete a project
 * @param projectId ID of the project to delete
 * @returns ProjectActionState with status and message
 */
export async function deleteProject(
  projectId: string
): Promise<ProjectActionState> {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "You must be logged in to delete a project.",
      errors: { _form: ["Unauthorized access."] },
    };
  }

  try {
    // 2. Check if project exists and belongs to the user
    const existingProject = await db.query.projects.findFirst({
      where: (projects, { and, eq }) =>
        and(eq(projects.id, projectId), eq(projects.userId, session.user.id)),
    });

    if (!existingProject) {
      return {
        status: "error",
        message: "Project not found or you don't have permission to delete it.",
        errors: { _form: ["Project not found."] },
      };
    }

    // 3. Delete the project (cascade will handle related tasks)
    await db.delete(projects).where(eq(projects.id, projectId));

    // 4. Revalidate projects page to update cache
    revalidatePath("/projects");

    // 5. Return success
    return {
      status: "success",
      message: "Project deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return {
      status: "error",
      message: "Failed to delete project. Please try again.",
      errors: { _form: ["Database error occurred."] },
    };
  }
}
