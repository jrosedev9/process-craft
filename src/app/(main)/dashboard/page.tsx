import React from 'react';
import { Suspense } from 'react';
import { getProjects } from '@/app/actions/project.actions';
import ProjectList from '@/components/dashboard/ProjectList';
import { DashboardActions } from '@/components/dashboard/DashboardActions';

// Loading component for Suspense fallback
function ProjectsLoading() {
  return (
    <div className="py-6">
      <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4"></div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded"></div>
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  // Fetch projects server-side
  const projects = await getProjects();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DashboardActions />
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectList projects={projects || []} />
        </Suspense>
      </section>
    </div>
  );
}