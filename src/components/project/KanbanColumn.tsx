"use client";

import React from "react";
import { Task } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  CircleIcon,
  ClockIcon,
  CheckCircleIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { TaskFormDialog } from "./TaskFormDialog";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function KanbanColumn({
  title,
  tasks,
  status,
  projectId,
  icon = "circle",
  color = "text-muted-foreground",
}: KanbanColumnProps) {
  // Determine the color based on status
  const getStatusInfo = () => {
    switch (status) {
      case "To Do":
        return {
          textColor: "text-[var(--status-todo)]",
          bgColor: "bg-[var(--status-todo)]/10",
          borderColor: "border-[var(--status-todo)]/20",
        };
      case "In Progress":
        return {
          textColor: "text-[var(--status-in-progress)]",
          bgColor: "bg-[var(--status-in-progress)]/10",
          borderColor: "border-[var(--status-in-progress)]/20",
        };
      case "Done":
        return {
          textColor: "text-[var(--status-done)]",
          bgColor: "bg-[var(--status-done)]/10",
          borderColor: "border-[var(--status-done)]/20",
        };
      default:
        return {
          textColor: color,
          bgColor: "bg-muted/10",
          borderColor: "border-muted",
        };
    }
  };

  const { textColor, bgColor, borderColor } = getStatusInfo();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = React.useState(false);

  // Get the appropriate icon based on the column status
  const StatusIcon = React.useMemo(() => {
    switch (icon) {
      case "circle":
        return CircleIcon;
      case "clock":
        return ClockIcon;
      case "check-circle":
        return CheckCircleIcon;
      default:
        return CircleIcon;
    }
  }, [icon]);

  // Set up droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      accepts: ["task"],
      status,
    },
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      {/* Column header */}
      <CardHeader className="flex flex-row justify-between items-center p-4 border-b bg-muted/10 space-y-0">
        <div className="flex items-center gap-2">
          <StatusIcon className={cn("h-4 w-4", textColor)} />
          <h3 className="font-medium text-sm">{title}</h3>
          <Badge
            variant="secondary"
            className="text-xs h-5 px-1.5 rounded-full"
          >
            {tasks.length}
          </Badge>
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
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-muted/50 text-muted-foreground"
              >
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsCreateTaskOpen(true)}>
                Add task
              </DropdownMenuItem>
              <DropdownMenuItem>Sort by date</DropdownMenuItem>
              <DropdownMenuItem>Sort by name</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Task list */}
      <CardContent
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto p-3 space-y-2 transition-colors",
          isOver ? bgColor : "bg-muted/5"
        )}
      >
        {tasks.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center h-32 text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg m-2",
              borderColor
            )}
          >
            <p>No tasks yet</p>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "mt-2 text-xs h-8",
                textColor,
                bgColor.replace(/10$/, "20")
              )}
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
      </CardContent>

      <TaskFormDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        projectId={projectId}
        defaultStatus={status}
        showStatusSelect={false} // Hide status select since we're creating in a specific column
      />
    </Card>
  );
}
