"use client";

import React from "react";
import { Task } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { PlusIcon, CircleIcon, ClockIcon, CheckCircleIcon, MoreHorizontalIcon } from "lucide-react";
import { TaskFormDialog } from "./TaskFormDialog";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: "To Do" | "In Progress" | "Done";
  projectId: string;
  icon?: "circle" | "clock" | "check-circle";
  color?: string;
}

export function KanbanColumn({
  title,
  tasks,
  status,
  projectId,
  icon = "circle",
  color = "text-muted-foreground"
}: KanbanColumnProps) {
  // Determine the color based on status
  const getStatusColor = () => {
    switch (status) {
      case "To Do": return "text-[var(--status-todo)]";
      case "In Progress": return "text-[var(--status-in-progress)]";
      case "Done": return "text-[var(--status-done)]";
      default: return color;
    }
  };
  const [isCreateTaskOpen, setIsCreateTaskOpen] = React.useState(false);

  // Get the appropriate icon based on the column status
  const StatusIcon = React.useMemo(() => {
    switch (icon) {
      case "circle": return CircleIcon;
      case "clock": return ClockIcon;
      case "check-circle": return CheckCircleIcon;
      default: return CircleIcon;
    }
  }, [icon]);

  // Set up droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      accepts: ['task'],
      status
    },
  });

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden">
      {/* Column header */}
      <div className="flex justify-between items-center p-4 border-b bg-muted/10">
        <div className="flex items-center gap-2">
          <StatusIcon className={cn("h-4 w-4", getStatusColor())} />
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-muted">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-[var(--amber-orange)]/10 text-[var(--amber-orange)]"
            onClick={() => setIsCreateTaskOpen(true)}
          >
            <PlusIcon className="h-4 w-4" />
            <span className="sr-only">Add task</span>
          </Button>
          {/* Dropdown menu for additional actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-muted/50 text-muted-foreground">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsCreateTaskOpen(true)}>Add task</DropdownMenuItem>
              <DropdownMenuItem>Sort by date</DropdownMenuItem>
              <DropdownMenuItem>Sort by name</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Task list */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto p-3 space-y-2 transition-colors",
          isOver ? "bg-muted/20" : "bg-muted/5"
        )}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg border-muted m-2">
            <p>No tasks yet</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs h-8 text-[var(--amber-orange)] hover:bg-[var(--amber-orange)]/10"
              onClick={() => setIsCreateTaskOpen(true)}
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add a task
            </Button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} status={status} />
          ))
        )}
      </div>

      <TaskFormDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        projectId={projectId}
        defaultStatus={status}
        showStatusSelect={false} // Hide status select since we're creating in a specific column
      />
    </div>
  );
}
