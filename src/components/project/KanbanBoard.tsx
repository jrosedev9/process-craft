"use client";

import React, { useEffect, useState } from "react";
import { Project, Task } from "@/lib/types";
import KanbanColumn from "./KanbanColumn";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import { updateTaskStatus } from "@/app/actions/task.actions";
import { TaskCard } from "./TaskCard";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleIcon, ClockIcon, CheckCircleIcon } from "lucide-react";

interface KanbanBoardProps {
  project: Project;
}

export function KanbanBoard({ project }: KanbanBoardProps) {
  // State to manage tasks locally for optimistic updates
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  // State for active drag item
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Initialize client-side state after hydration
  useEffect(() => {
    setIsClient(true);
    setLocalTasks(project.tasks || []);
  }, [project.tasks]);

  // If not yet hydrated, return a simple loading state
  if (!isClient) {
    return (
      <div className="space-y-4">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">
                Task Progress
              </CardTitle>
              <span className="text-xs text-muted-foreground">Loading...</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={0} className="mb-1" />
            <div className="text-xs text-muted-foreground text-right">
              Loading...
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[calc(100vh-250px)]">
          {/* To Do Column Skeleton */}
          <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center p-4 border-b bg-muted/10 space-y-0">
              <div className="flex items-center gap-2">
                <CircleIcon className="h-4 w-4 text-[var(--status-todo)]" />
                <h3 className="font-medium text-sm">To Do</h3>
                <Badge
                  variant="secondary"
                  className="text-xs h-5 px-1.5 rounded-full"
                >
                  0
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/5">
              <div className="animate-pulse space-y-3">
                <div className="h-20 bg-muted rounded-md"></div>
                <div className="h-20 bg-muted rounded-md"></div>
              </div>
            </CardContent>
          </Card>

          {/* In Progress Column Skeleton */}
          <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center p-4 border-b bg-muted/10 space-y-0">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-[var(--status-in-progress)]" />
                <h3 className="font-medium text-sm">In Progress</h3>
                <Badge
                  variant="secondary"
                  className="text-xs h-5 px-1.5 rounded-full"
                >
                  0
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/5">
              <div className="animate-pulse space-y-3">
                <div className="h-20 bg-muted rounded-md"></div>
              </div>
            </CardContent>
          </Card>

          {/* Done Column Skeleton */}
          <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center p-4 border-b bg-muted/10 space-y-0">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-[var(--status-done)]" />
                <h3 className="font-medium text-sm">Done</h3>
                <Badge
                  variant="secondary"
                  className="text-xs h-5 px-1.5 rounded-full"
                >
                  0
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/5">
              <div className="animate-pulse space-y-3">
                <div className="h-20 bg-muted rounded-md"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Group tasks by status
  const todoTasks = localTasks.filter((task) => task.status === "To Do");
  const inProgressTasks = localTasks.filter(
    (task) => task.status === "In Progress"
  );
  const doneTasks = localTasks.filter((task) => task.status === "Done");

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    const task = localTasks.find((t) => t.id === taskId);
    if (task) setActiveTask(task);
  };

  // Handle drag end event
  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    // Extract task ID from the active draggable
    const taskId = active.id as string;

    // Extract column status from the droppable ID
    const newStatus = over.id as "To Do" | "In Progress" | "Done";

    // Find the task that was dragged
    const draggedTask = localTasks.find((task) => task.id === taskId);

    if (!draggedTask || draggedTask.status === newStatus) return;

    // Store the original task for potential rollback
    const originalTask = { ...draggedTask };

    // Calculate new order (for now, just use 0 as we're not implementing full sorting)
    const newOrder = 0;

    // Optimistic update - update local state immediately
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      // Update the task status in the database
      const result = await updateTaskStatus(taskId, newStatus, newOrder);

      // Handle server response
      if (result?.status === "error") {
        // Revert optimistic update if server update failed
        setLocalTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? originalTask : task))
        );

        // Show error message
        toast({
          title: "Error",
          description: result.message || "Failed to update task status",
          variant: "destructive", // Using our red error toast
        });
      } else if (result?.status === "success") {
        // Show success message (optional)
        toast({
          title: "Success",
          description: "Task moved successfully",
          variant: "success", // Using our green success toast
        });
      }
    } catch (error) {
      // Revert optimistic update on exception
      setLocalTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? originalTask : task))
      );

      // Show error message
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive", // Using our red error toast
      });

      console.error("Error updating task status:", error);
    }
  };

  // Calculate task counts for display
  const totalTasks = localTasks.length;
  const completedTasks = doneTasks.length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Task progress summary */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Task Progress</CardTitle>
            <span className="text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="mb-1" />
          <div className="text-xs text-muted-foreground text-right">
            {completionPercentage}% complete
          </div>
        </CardContent>
      </Card>

      {/* Kanban columns */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[calc(100vh-250px)]">
          <KanbanColumn
            title="To Do"
            tasks={todoTasks}
            status="To Do"
            projectId={project.id}
            icon="circle"
          />
          <KanbanColumn
            title="In Progress"
            tasks={inProgressTasks}
            status="In Progress"
            projectId={project.id}
            icon="clock"
          />
          <KanbanColumn
            title="Done"
            tasks={doneTasks}
            status="Done"
            projectId={project.id}
            icon="check-circle"
          />
        </div>

        {/* Drag overlay for showing a preview of the dragged task */}
        <DragOverlay>
          {activeTask ? (
            <div className="w-full opacity-80 pointer-events-none">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
