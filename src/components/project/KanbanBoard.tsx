"use client";

import React from "react";
import { Project } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  project: Project;
}

export function KanbanBoard({ project }: KanbanBoardProps) {
  // Group tasks by status
  const tasks = project.tasks || [];

  const todoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter((task) => task.status === "Done");

  // Calculate task counts for display
  const totalTasks = tasks.length;
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
    </div>
  );
}
