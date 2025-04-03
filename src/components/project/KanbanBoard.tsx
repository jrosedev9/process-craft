"use client";

import React, { useEffect, useState } from "react";
import { Project, Task } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, DragOverlay } from "@dnd-kit/core";
import { updateTaskStatus } from "@/app/actions/task.actions";
import type { TaskActionState } from "@/app/actions/task.actions";
import { TaskCard } from "./TaskCard";
import { toast } from "@/components/ui/use-toast";

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
        <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-[#2D3436]">Task Progress</h3>
            <span className="text-xs text-gray-500">Loading...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div className="bg-[#88B04B] h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: '0%' }}></div>
          </div>
          <div className="text-xs text-gray-500 text-right">Loading...</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[calc(100vh-250px)]">
          <div className="bg-muted/5 rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">To Do</h3>
            </div>
            <div className="animate-pulse space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="bg-muted/5 rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">In Progress</h3>
            </div>
            <div className="animate-pulse space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="bg-muted/5 rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Done</h3>
            </div>
            <div className="animate-pulse space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group tasks by status
  const todoTasks = localTasks.filter((task) => task.status === "To Do");
  const inProgressTasks = localTasks.filter((task) => task.status === "In Progress");
  const doneTasks = localTasks.filter((task) => task.status === "Done");

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    const task = localTasks.find(t => t.id === taskId);
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
    const draggedTask = localTasks.find(task => task.id === taskId);

    if (!draggedTask || draggedTask.status === newStatus) return;

    // Store the original task for potential rollback
    const originalTask = { ...draggedTask };

    // Calculate new order (for now, just use 0 as we're not implementing full sorting)
    const newOrder = 0;

    // Optimistic update - update local state immediately
    setLocalTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );

    try {
      // Update the task status in the database
      const result = await updateTaskStatus(taskId, newStatus, newOrder);

      // Handle server response
      if (result?.status === "error") {
        // Revert optimistic update if server update failed
        setLocalTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId
              ? originalTask
              : task
          )
        );

        // Show error message
        toast({
          title: "Error",
          description: result.message || "Failed to update task status",
          variant: "destructive" // Using our red error toast
        });
      } else if (result?.status === "success") {
        // Show success message (optional)
        toast({
          title: "Success",
          description: "Task moved successfully",
          variant: "success" // Using our green success toast
        });
      }
    } catch (error) {
      // Revert optimistic update on exception
      setLocalTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? originalTask
            : task
        )
      );

      // Show error message
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive" // Using our red error toast
      });

      console.error("Error updating task status:", error);
    }
  };

  // Calculate task counts for display
  const totalTasks = localTasks.length;
  const completedTasks = doneTasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Task progress summary */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-[#2D3436]">Task Progress</h3>
          <span className="text-xs text-gray-500">{completedTasks} of {totalTasks} tasks completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div
            className="bg-[#88B04B] h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 text-right">{completionPercentage}% complete</div>
      </div>

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
