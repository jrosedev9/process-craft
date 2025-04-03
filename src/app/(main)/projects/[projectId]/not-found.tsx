import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The project you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Button asChild>
        <Link href="/dashboard">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
