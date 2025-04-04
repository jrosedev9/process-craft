import React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { getProjects } from '@/app/actions/project.actions';
import { getTaskCounts } from '@/app/actions/task.actions';
import { DashboardActions } from '@/components/dashboard/DashboardActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRightIcon, LayoutDashboardIcon, FolderKanbanIcon, ClockIcon, CheckCircleIcon } from 'lucide-react';

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
  // Fetch projects and task counts server-side
  const [projects, taskCounts] = await Promise.all([
    getProjects(),
    getTaskCounts()
  ]);

  // Calculate some stats for the dashboard
  const totalProjects = projects?.length || 0;
  const recentProjects = projects?.slice(0, 3) || [];

  // Task stats
  const totalTasks = taskCounts?.total || 0;
  const activeTasks = (taskCounts?.todo || 0) + (taskCounts?.inProgress || 0);
  const completedTasks = taskCounts?.done || 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your project management dashboard</p>
        </div>
        <DashboardActions />
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2 rounded-full p-2 bg-primary/10">
                <FolderKanbanIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{totalProjects}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2 rounded-full p-2 bg-[var(--amber-orange)]/10">
                <ClockIcon className="h-4 w-4 text-[var(--amber-orange)]" />
              </div>
              <div className="text-2xl font-bold">{activeTasks}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2 rounded-full p-2 bg-[var(--sage-green)]/10">
                <CheckCircleIcon className="h-4 w-4 text-[var(--sage-green)]" />
              </div>
              <div className="text-2xl font-bold">{completedTasks}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2 rounded-full p-2 bg-[var(--midnight-blue)]/10">
                <LayoutDashboardIcon className="h-4 w-4 text-[var(--midnight-blue)]" />
              </div>
              <div className="flex flex-col w-full">
                <div className="text-2xl font-bold mb-1">{completionPercentage}%</div>
                <Progress value={completionPercentage} className="h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/projects">
                  View All
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ProjectsLoading />}>
              {recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {project.description || "No description"}
                        </div>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/projects/${project.id}`}>
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No projects yet</p>
                  <Button asChild>
                    <Link href="/projects/new">Create Project</Link>
                  </Button>
                </div>
              )}
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/projects/new">
                <FolderKanbanIcon className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/projects">
                <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                View All Projects
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}