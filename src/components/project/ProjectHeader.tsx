"use client";

import React from "react";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="ml-auto">
          <SettingsIcon className="mr-2 h-4 w-4" />
          Project Settings
        </Button>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground mt-1">{project.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          Created {formatDate(project.createdAt)}
        </p>
      </div>
    </div>
  );
}
