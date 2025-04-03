"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { createTask } from "@/app/actions/task.actions";
import type { TaskActionState } from "@/app/actions/task.actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  defaultStatus: "To Do" | "In Progress" | "Done";
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Task"}
    </Button>
  );
}

export function CreateTaskDialog({ 
  open, 
  onOpenChange, 
  projectId,
  defaultStatus 
}: CreateTaskDialogProps) {
  // Use action state to manage form submission
  const [state, formAction] = useActionState<TaskActionState, FormData>(
    createTask,
    null
  );

  // Handle successful task creation
  React.useEffect(() => {
    if (state?.status === "success") {
      // Close the dialog after successful creation
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to the {defaultStatus} column.
          </DialogDescription>
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

          {/* Hidden project ID field */}
          <input type="hidden" name="projectId" value={projectId} />
          
          {/* Hidden status field */}
          <input type="hidden" name="status" value={defaultStatus} />

          {/* Task title field */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Task Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter task title"
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
              rows={3}
              aria-invalid={state?.errors?.description ? "true" : undefined}
            />
            {state?.errors?.description && (
              <p className="text-sm text-destructive">{state.errors.description[0]}</p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
