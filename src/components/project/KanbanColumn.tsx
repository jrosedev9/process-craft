"use client";

import React from "react";
import { Task } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TaskFormDialog } from "./TaskFormDialog";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: "To Do" | "In Progress" | "Done";
  projectId: string;
}

export function KanbanColumn({ title, tasks, status, projectId }: KanbanColumnProps) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-full bg-muted/30 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-sm">{title} ({tasks.length})</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setIsCreateTaskOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          <span className="sr-only">Add task</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No tasks yet
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
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
