"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { projects, tasks } from "@/lib/db/schema";
import {
  taskCreateSchema,
  taskUpdateSchema,
  taskStatusUpdateSchema,
} from "@/lib/validators";
import { and, eq, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

// Type for the return value of task actions
export type TaskActionState = {
  status: "success" | "error";
  message: string;
  data?: unknown;
  errors?: Record<string, string[]> | null;
} | null;

/**
 * Helper function to verify project ownership
 * @param userId User ID to check ownership against
 * @param projectId Project ID to check
 * @returns Boolean indicating if the user owns the project
 */
async function verifyProjectOwnership(
  userId: string,
  projectId: string
): Promise<boolean> {
  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
  });
  return !!project;
}

/**
 * Helper function to verify task ownership (via project ownership)
 * @param userId User ID to check ownership against
 * @param taskId Task ID to check
 * @returns Object containing ownership status and project ID if found
 */
async function verifyTaskOwnership(
  userId: string,
  taskId: string
): Promise<{ isOwner: boolean; projectId?: string }> {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: {
      project: true,
    },
  });

  if (!task || !task.project) {
    return { isOwner: false };
  }

  return {
    isOwner: task.project.userId === userId,
    projectId: task.project.id,
  };
}

/**
 * Create a new task
 * @param _prevState Previous state from useActionState
 * @param formData Form data containing task details
 * @returns TaskActionState with status and data/errors
 */
export async function createTask(
  _prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "You must be logged in to create a task.",
      errors: { _form: ["Unauthorized access."] },
    };
  }

  // 2. Validate input data
  const validatedFields = taskCreateSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    projectId: formData.get("projectId"),
    status: formData.get("status") || "To Do",
    order: Number(formData.get("order") || 0),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid task data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, description, projectId, status, order } = validatedFields.data;

  // 3. Verify project ownership
  const hasAccess = await verifyProjectOwnership(session.user.id, projectId);
  if (!hasAccess) {
    return {
      status: "error",
      message:
        "Project not found or you don't have permission to add tasks to it.",
      errors: { _form: ["Project access denied."] },
    };
  }

  try {
    // 4. Insert task into database
    const taskId = uuidv4();
    const [newTask] = await db
      .insert(tasks)
      .values({
        id: taskId,
        title,
        description: description || null,
        status,
        order,
        projectId,
      })
      .returning();

    // 5. Revalidate project page to update cache
    revalidatePath(`/projects/${projectId}`);

    // 6. Return success with the new task data
    return {
      status: "success",
      message: "Task created successfully.",
      data: newTask,
    };
  } catch (error) {
    console.error("Failed to create task:", error);
    return {
      status: "error",
      message: "Failed to create task. Please try again.",
      errors: { _form: ["Database error occurred."] },
    };
  }
}

/**
 * Get all tasks for a specific project
 * @param projectId ID of the project to fetch tasks for
 * @returns Array of tasks or null if not authenticated or not authorized
 */
export async function getTasksByProjectId(projectId: string) {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  // 2. Verify project ownership
  const hasAccess = await verifyProjectOwnership(session.user.id, projectId);
  if (!hasAccess) {
    return null;
  }

  try {
    // 3. Fetch tasks for the project
    const projectTasks = await db.query.tasks.findMany({
      where: eq(tasks.projectId, projectId),
      orderBy: (tasks, { asc }) => [asc(tasks.order)],
    });

    return projectTasks;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return null;
  }
}

/**
 * Update task details
 * @param taskId ID of the task to update
 * @param formData Form data containing task details to update
 * @returns TaskActionState with status and data/errors
 */
export async function updateTaskDetails(
  taskId: string,
  formData: FormData
): Promise<TaskActionState> {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "You must be logged in to update a task.",
      errors: { _form: ["Unauthorized access."] },
    };
  }

  // 2. Validate input data
  console.log('Update task details:', { taskId, formData: Object.fromEntries(formData.entries()) });

  const validatedFields = taskUpdateSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
  });

  console.log('Validation result:', validatedFields);

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid task data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 3. Verify task ownership
  const { isOwner, projectId } = await verifyTaskOwnership(
    session.user.id,
    taskId
  );

  if (!isOwner || !projectId) {
    return {
      status: "error",
      message: "Task not found or you don't have permission to update it.",
      errors: { _form: ["Task access denied."] },
    };
  }

  try {
    console.log('Updating task with data:', validatedFields.data);

    // 4. Update the task
    const [updatedTask] = await db
      .update(tasks)
      .set(validatedFields.data)
      .where(eq(tasks.id, taskId))
      .returning();

    console.log('Task updated successfully:', updatedTask);

    // 5. Revalidate project page to update cache
    revalidatePath(`/projects/${projectId}`);

    // 6. Return success with the updated task data
    const result: TaskActionState = {
      status: "success",
      message: "Task updated successfully.",
      data: updatedTask,
    };

    console.log('Returning result:', result);
    return result;
  } catch (error) {
    console.error("Failed to update task:", error);
    return {
      status: "error",
      message: "Failed to update task. Please try again.",
      errors: { _form: ["Database error occurred."] },
    };
  }
}

/**
 * Delete a task
 * @param taskId ID of the task to delete
 * @returns TaskActionState with status and message
 */
export async function deleteTask(taskId: string): Promise<TaskActionState> {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "You must be logged in to delete a task.",
      errors: { _form: ["Unauthorized access."] },
    };
  }

  // 2. Verify task ownership
  const { isOwner, projectId } = await verifyTaskOwnership(
    session.user.id,
    taskId
  );

  if (!isOwner || !projectId) {
    return {
      status: "error",
      message: "Task not found or you don't have permission to delete it.",
      errors: { _form: ["Task access denied."] },
    };
  }

  try {
    // 3. Delete the task
    await db.delete(tasks).where(eq(tasks.id, taskId));

    // 4. Revalidate project page to update cache
    revalidatePath(`/projects/${projectId}`);

    // 5. Return success
    return {
      status: "success",
      message: "Task deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return {
      status: "error",
      message: "Failed to delete task. Please try again.",
      errors: { _form: ["Database error occurred."] },
    };
  }
}

/**
 * Get task counts by status for the current user across all projects
 * @returns Object with counts for each status or null if not authenticated
 */
export async function getTaskCounts() {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    // Get all projects for the user
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.userId, session.user.id),
      columns: { id: true },
    });

    // If no projects, return zeros
    if (!userProjects.length) {
      return {
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
      };
    }

    // Get project IDs
    const projectIds = userProjects.map(project => project.id);

    // Count tasks by status
    const todoCount = await db.select({ count: count() })
      .from(tasks)
      .where(and(
        eq(tasks.status, "To Do"),
        sql`${tasks.projectId} IN (${projectIds.join(",")})`
      ));

    const inProgressCount = await db.select({ count: count() })
      .from(tasks)
      .where(and(
        eq(tasks.status, "In Progress"),
        sql`${tasks.projectId} IN (${projectIds.join(",")})`
      ));

    const doneCount = await db.select({ count: count() })
      .from(tasks)
      .where(and(
        eq(tasks.status, "Done"),
        sql`${tasks.projectId} IN (${projectIds.join(",")})`
      ));

    const totalCount = await db.select({ count: count() })
      .from(tasks)
      .where(sql`${tasks.projectId} IN (${projectIds.join(",")})`);

    return {
      total: totalCount[0]?.count || 0,
      todo: todoCount[0]?.count || 0,
      inProgress: inProgressCount[0]?.count || 0,
      done: doneCount[0]?.count || 0,
    };
  } catch (error) {
    console.error("Failed to fetch task counts:", error);
    return null;
  }
}

/**
 * Update task status and order (for Kanban drag-and-drop)
 * @param taskId ID of the task to update
 * @param newStatus New status for the task
 * @param newOrder New order for the task
 * @returns TaskActionState with status and data/errors
 */
export async function updateTaskStatus(
  taskId: string,
  newStatus: string,
  newOrder: number
): Promise<TaskActionState> {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "You must be logged in to update a task.",
      errors: { _form: ["Unauthorized access."] },
    };
  }

  // 2. Validate input data
  const validatedFields = taskStatusUpdateSchema.safeParse({
    status: newStatus,
    order: newOrder,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid task status data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 3. Verify task ownership
  const { isOwner, projectId } = await verifyTaskOwnership(
    session.user.id,
    taskId
  );

  if (!isOwner || !projectId) {
    return {
      status: "error",
      message: "Task not found or you don't have permission to update it.",
      errors: { _form: ["Task access denied."] },
    };
  }

  try {
    // 4. Update the task status and order
    const [updatedTask] = await db
      .update(tasks)
      .set({
        status: validatedFields.data.status,
        order: validatedFields.data.order,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    // 5. Revalidate project page to update cache
    revalidatePath(`/projects/${projectId}`);

    // 6. Return success with the updated task data
    return {
      status: "success",
      message: "Task status updated successfully.",
      data: updatedTask,
    };
  } catch (error) {
    console.error("Failed to update task status:", error);
    return {
      status: "error",
      message: "Failed to update task status. Please try again.",
      errors: { _form: ["Database error occurred."] },
    };
  }
}
