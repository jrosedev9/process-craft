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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KanbanColumn
        title="To Do"
        tasks={todoTasks}
        status="To Do"
        projectId={project.id}
      />
      <KanbanColumn
        title="In Progress"
        tasks={inProgressTasks}
        status="In Progress"
        projectId={project.id}
      />
      <KanbanColumn
        title="Done"
        tasks={doneTasks}
        status="Done"
        projectId={project.id}
      />
    </div>
  );
}
