"use client";

import React from "react";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, SettingsIcon, CalendarIcon, UsersIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild className="rounded-full border-primary text-primary hover:bg-primary/10 hover:text-primary hover:border-primary">
          <Link href="/dashboard">
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Badge variant="outline" className="rounded-full px-3 py-1 bg-accent/10 text-accent border-accent/20">
          <ClockIcon className="h-3 w-3 mr-1" />
          Active Project
        </Badge>
        <Button variant="outline" size="sm" className="ml-auto rounded-full border-muted text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-muted-foreground">
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4 text-primary" />
            <span>Owner</span>
          </div>
        </div>
      </div>
    </div>
  );
}
