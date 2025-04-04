import React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { getProjects } from '@/app/actions/project.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ArrowRightIcon, PlusIcon, SearchIcon, FilterIcon, SortAscIcon } from 'lucide-react';

// Loading component for Suspense fallback
function ProjectsLoading() {
  return (
    <div className="py-6">
      <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4"></div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded"></div>
        ))}
      </div>
    </div>
  );
}

export default async function ProjectsPage() {
  // Fetch projects server-side
  const projects = await getProjects();

  // Format date for display
  const formatDate = (timestamp: number | Date) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and organize all your projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/projects/new">
              <PlusIcon className="h-4 w-4 mr-1" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <FilterIcon className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <SortAscIcon className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      <Suspense fallback={<ProjectsLoading />}>
        {projects && projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge variant="outline" className="bg-[var(--sage-green)]/10 text-[var(--sage-green)] border-[var(--sage-green)]/20">
                      Active
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>Created {formatDate(project.createdAt)}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button asChild className="w-full">
                    <Link href={`/projects/${project.id}`}>
                      View Project <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-xl border p-8">
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first project to start organizing your tasks and tracking progress.
            </p>
            <Button asChild>
              <Link href="/projects/new">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Project
              </Link>
            </Button>
          </div>
        )}
      </Suspense>
    </div>
  );
}
