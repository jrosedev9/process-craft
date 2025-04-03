"use client";

import React from "react";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, SettingsIcon, CalendarIcon, UsersIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild className="rounded-full border-[#FF6F61] text-[#FF6F61] hover:bg-[#FF6F61]/10 hover:text-[#FF6F61] hover:border-[#FF6F61]">
          <Link href="/dashboard">
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Badge variant="secondary" className="rounded-full px-3 py-1 bg-[#88B04B]/10 text-[#88B04B] border-none">
          <ClockIcon className="h-3 w-3 mr-1" />
          Active Project
        </Badge>
        <Button variant="outline" size="sm" className="ml-auto rounded-full border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400">
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D3436]">{project.name}</h1>
          {project.description && (
            <p className="text-gray-500 mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-[#FF6F61]" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4 text-[#FF6F61]" />
            <span>Owner</span>
          </div>
        </div>
      </div>
    </div>
  );
}
