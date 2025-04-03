import React from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProjectById } from "@/app/actions/project.actions";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { KanbanBoard } from "@/components/project/KanbanBoard";

// Loading component for Suspense fallback
function ProjectLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-64 bg-muted rounded mb-4"></div>
      <div className="h-4 w-1/2 bg-muted rounded mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted rounded"></div>
        ))}
      </div>
    </div>
  );
}

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = params;

  // Fetch project data with tasks
  const project = await getProjectById(projectId);

  // Handle not found or unauthorized
  if (!project) {
    // Check if the user is not authenticated (redirect to login)
    // or if the project doesn't exist or user doesn't have access (show not found)
    return notFound();
  }

  return (
    <div>
      <ProjectHeader project={project} />

      <Suspense fallback={<ProjectLoading />}>
        <KanbanBoard project={project} />
      </Suspense>
    </div>
  );
}

// Create a not-found page for this route
export function generateMetadata({ params }: ProjectPageProps) {
  return {
    title: `Project - ${params.projectId}`,
  };
}
