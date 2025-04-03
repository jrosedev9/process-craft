"use client";

import React from "react";
import { Task } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { updateTaskDetails, deleteTask } from "@/app/actions/task.actions";
import type { TaskActionState } from "@/app/actions/task.actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ExclamationTriangleIcon,
  CheckCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
}: EditTaskDialogProps) {
  // Use action state to manage form submission
  const [state, formAction] = useActionState<TaskActionState, FormData>(
    (state: TaskActionState, formData: FormData) =>
      updateTaskDetails(task.id, formData),
    null
  );

  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Handle successful task update
  React.useEffect(() => {
    if (state?.status === "success") {
      // Close the dialog after successful update
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  // Handle task deletion
  const handleDelete = async () => {
    if (showDeleteConfirm) {
      const result = await deleteTask(task.id);
      if (result?.status === "success") {
        onOpenChange(false);
      }
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

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

          {/* Task title field */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Task Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={task.title}
              required
              aria-invalid={state?.errors?.title ? "true" : undefined}
            />
            {state?.errors?.title && (
              <p className="text-sm text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          {/* Task description field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={task.description || ""}
              rows={3}
              aria-invalid={state?.errors?.description ? "true" : undefined}
            />
            {state?.errors?.description && (
              <p className="text-sm text-destructive">
                {state.errors.description[0]}
              </p>
            )}
          </div>

          {/* Submit and delete buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-1"
            >
              <TrashIcon className="h-4 w-4" />
              {showDeleteConfirm ? "Confirm Delete" : "Delete"}
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <SubmitButton />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
