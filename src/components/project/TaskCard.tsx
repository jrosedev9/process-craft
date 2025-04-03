"use client";

import React from "react";
import { Task } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { TaskFormDialog } from "./TaskFormDialog";
import { cn } from "@/lib/utils";
import { CalendarIcon, ClockIcon, CheckCircleIcon, CircleIcon, GripVerticalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
  task: Task;
  status?: "To Do" | "In Progress" | "Done";
}

export function TaskCard({ task, status }: TaskCardProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  // Format the creation date
  const formatDate = (timestamp: number | Date) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get status color and icon
  const getStatusInfo = () => {
    switch (task.status) {
      case "To Do":
        return { color: "text-[var(--status-todo)] bg-[var(--status-todo)]/10", icon: CircleIcon };
      case "In Progress":
        return { color: "text-[var(--status-in-progress)] bg-[var(--status-in-progress)]/10", icon: ClockIcon };
      case "Done":
        return { color: "text-[var(--status-done)] bg-[var(--status-done)]/10", icon: CheckCircleIcon };
      default:
        return { color: "text-gray-500 bg-gray-50", icon: CircleIcon };
    }
  };

  const { color, icon: StatusIcon } = getStatusInfo();

  // Only show status badge if the task status is different from the column status
  const showStatusBadge = status !== task.status;

  // Set up draggable
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
  } : undefined;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          isDragging ? "opacity-50" : "opacity-100",
          "touch-none"
        )}
      >
        <Card
          className={cn(
            "hover:shadow-md transition-all duration-200 overflow-hidden group",
            isDragging ? "shadow-lg ring-2 ring-primary" : ""
          )}
          onClick={(e) => {
            // Don't open edit dialog when using drag handle
            if ((e.target as HTMLElement).closest('.drag-handle')) return;
            setIsEditOpen(true);
          }}
          {...attributes}
          {...listeners}
        >
        <div className={cn(
          "h-1 w-full",
          task.status === "To Do" ? "bg-[var(--status-todo)]" :
          task.status === "In Progress" ? "bg-[var(--status-in-progress)]" :
          "bg-[var(--status-done)]"
        )} />
        <CardHeader className="p-3 pb-1 flex justify-between items-start">
          <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
            {task.title}
          </CardTitle>
          <div
            className="drag-handle cursor-grab active:cursor-grabbing p-1 -mt-1 -mr-1 rounded hover:bg-muted/50"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        {task.description && (
          <CardContent className="p-3 pt-1 pb-2">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          </CardContent>
        )}
        <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {formatDate(task.createdAt)}
          </div>
          {showStatusBadge && (
            <Badge variant="outline" className={cn("text-xs px-2 py-0 h-5 flex items-center gap-1", color)}>
              <StatusIcon className="h-2.5 w-2.5" />
              {task.status}
            </Badge>
          )}
        </CardFooter>
      </Card>
      </div>

      <TaskFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        task={task}
        showStatusSelect={true} // Show status select in edit mode
      />
    </>
  );
}
