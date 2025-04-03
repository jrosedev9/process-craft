"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createTask, updateTaskDetails } from "@/app/actions/task.actions";
import type { TaskActionState } from "@/app/actions/task.actions";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Submit button with loading state
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? isEditing ? "Saving..." : "Creating..."
        : isEditing ? "Save Changes" : "Create Task"}
    </Button>
  );
}

interface TaskFormProps {
  projectId?: string; // Required for create, not for edit
  task?: Task; // Required for edit, not for create
  onSuccess?: () => void;
  showStatusSelect?: boolean; // Whether to show the status dropdown
  defaultStatus?: "To Do" | "In Progress" | "Done"; // Default status for new tasks
}

export function TaskForm({
  projectId,
  task,
  onSuccess,
  showStatusSelect = true,
  defaultStatus = "To Do",
}: TaskFormProps) {
  const isEditing = !!task;

  // Create a server action function that handles both create and edit
  const serverAction = React.useCallback(
    async (prevState: TaskActionState | null, formData: FormData) => {
      console.log('Form submission:', Object.fromEntries(formData.entries()));
      try {
        if (isEditing && task) {
          return await updateTaskDetails(task.id, formData);
        } else {
          return await createTask(prevState, formData);
        }
      } catch (error) {
        console.error('Error in server action:', error);
        return {
          status: 'error',
          message: 'An unexpected error occurred.',
          errors: { _form: ['Failed to process your request.'] }
        } as TaskActionState;
      }
    },
    [isEditing, task]
  );

  // Use action state to manage form submission
  const [state, formAction] = useActionState<TaskActionState, FormData>(serverAction, null);

  // Handle successful task creation/update
  React.useEffect(() => {
    console.log('Form state updated:', state);
    if (state?.status === "success" && onSuccess) {
      console.log('Calling onSuccess callback');
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      {/* Success message */}
      {state?.status === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircledIcon className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            {state.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {state?.status === "error" && state.errors?._form && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{state.errors._form[0]}</AlertDescription>
        </Alert>
      )}

      {/* Hidden project ID field for create */}
      {!isEditing && projectId && (
        <input type="hidden" name="projectId" value={projectId} />
      )}

      {/* Task title field */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Task Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter task title"
          defaultValue={task?.title || ""}
          required
          aria-invalid={state?.errors?.title ? "true" : undefined}
        />
        {state?.errors?.title && (
          <p className="text-sm text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      {/* Task description field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter task description (optional)"
          defaultValue={task?.description || ""}
          rows={3}
          aria-invalid={state?.errors?.description ? "true" : undefined}
        />
        {state?.errors?.description && (
          <p className="text-sm text-destructive">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {/* Task status field (only if showStatusSelect is true) */}
      {showStatusSelect ? (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={task?.status || "To Do"}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
          {state?.errors?.status && (
            <p className="text-sm text-destructive">{state.errors.status[0]}</p>
          )}
        </div>
      ) : (
        // Hidden status field when not showing the select
        !isEditing && <input type="hidden" name="status" value={defaultStatus} />
      )}

      {/* Submit button */}
      <div className="flex justify-end">
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
