"use client";

import React from "react";
import { Task } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskFormDialog } from "./TaskFormDialog";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  return (
    <>
      <Card
        className="cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => setIsEditOpen(true)}
      >
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        </CardHeader>
        {task.description && (
          <CardContent className="p-3 pt-2">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          </CardContent>
        )}
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
