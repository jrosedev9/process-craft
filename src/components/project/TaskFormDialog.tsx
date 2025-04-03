"use client";

import React from "react";
import { Task } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./TaskForm";
import { TrashIcon } from "@radix-ui/react-icons";
import { deleteTask } from "@/app/actions/task.actions";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string; // Required for create, not for edit
  task?: Task; // Required for edit, not for create
  defaultStatus?: "To Do" | "In Progress" | "Done"; // For create in a specific column
  showStatusSelect?: boolean; // Whether to show the status dropdown
}

export function TaskFormDialog({
  open,
  onOpenChange,
  projectId,
  task,
  defaultStatus = "To Do",
  showStatusSelect = true,
}: TaskFormDialogProps) {
  const isEditing = !!task;
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Handle task deletion
  const handleDelete = async () => {
    if (!task) return;

    if (showDeleteConfirm) {
      const result = await deleteTask(task.id);
      if (result?.status === "success") {
        onOpenChange(false);
      }
    } else {
      setShowDeleteConfirm(true);
    }
  };

  // Reset delete confirmation when dialog closes
  React.useEffect(() => {
    if (!open) {
      setShowDeleteConfirm(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create New Task"}</DialogTitle>
          {!isEditing && defaultStatus && (
            <DialogDescription>
              Add a new task to the {defaultStatus} column.
            </DialogDescription>
          )}
        </DialogHeader>

        <TaskForm
          projectId={projectId}
          task={task}
          onSuccess={() => {
            console.log('Task form success callback');
            onOpenChange(false);
          }}
          showStatusSelect={showStatusSelect}
          defaultStatus={defaultStatus}
        />

        {/* Delete button (only for edit) */}
        {isEditing && (
          <DialogFooter className="mt-4 flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-1"
            >
              <TrashIcon className="h-4 w-4" />
              {showDeleteConfirm ? "Confirm Delete" : "Delete"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
