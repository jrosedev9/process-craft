import React from "react";
import { CreateProjectForm } from "@/components/dashboard/CreateProjectForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
        <p className="text-muted-foreground mb-6">
          Create a new project to organize your tasks and track progress.
        </p>
        <CreateProjectForm />
      </div>
    </div>
  );
}
