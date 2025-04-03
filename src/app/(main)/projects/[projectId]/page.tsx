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
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage(props: ProjectPageProps) {
  const params = await props.params;
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="bg-card rounded-xl border shadow-sm p-6 mb-8 border-[var(--border)]">
        <ProjectHeader project={project} />
      </div>

      <Suspense fallback={<ProjectLoading />}>
        <KanbanBoard project={project} />
      </Suspense>
    </div>
  );
}

// Create metadata for this route
export async function generateMetadata(props: ProjectPageProps) {
  const params = await props.params;
  // In Next.js 15.2, we need to await params before accessing its properties
  return {
    title: `Project - ${params.projectId}`,
  };
}
