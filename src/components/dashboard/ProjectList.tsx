import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRightIcon } from "lucide-react";
import { CreateProjectModal } from "./CreateProjectModal";

// Define the Project type based on the database schema
type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: number | Date; // timestamp in milliseconds or Date object
  userId: string;
};

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  // Format date for display
  const formatDate = (timestamp: number | Date) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">No projects yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first project to get started.
        </p>
        <CreateProjectModal />
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>
              {project.description || "No description provided"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
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
  );
}
