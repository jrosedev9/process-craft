"use client";

import React from "react";
import { Task } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { TaskFormDialog } from "./TaskFormDialog";
import { cn } from "@/lib/utils";
import { CalendarIcon, ClockIcon, CheckCircleIcon, CircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-all duration-200 overflow-hidden group"
        onClick={() => setIsEditOpen(true)}
      >
        <div className={cn(
          "h-1 w-full",
          task.status === "To Do" ? "bg-[var(--status-todo)]" :
          task.status === "In Progress" ? "bg-[var(--status-in-progress)]" :
          "bg-[var(--status-done)]"
        )} />
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
            {task.title}
          </CardTitle>
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

      <TaskFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        task={task}
        showStatusSelect={true} // Show status select in edit mode
      />
    </>
  );
}
