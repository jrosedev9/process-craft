"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createProject } from "@/app/actions/project.actions";
import type { ProjectActionState } from "@/app/actions/project.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Project"}
    </Button>
  );
}

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const router = useRouter();
  
  // Use action state to manage form submission
  const [state, formAction] = useActionState<ProjectActionState, FormData>(
    createProject,
    null
  );

  // Handle successful project creation
  React.useEffect(() => {
    if (state?.status === "success") {
      // Call onSuccess callback if provided (for modal close)
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to the project page if we have project data
      if (state.data && typeof state.data === "object" && "id" in state.data) {
        router.push(`/projects/${state.data.id}`);
      } else {
        // Fallback to dashboard if no project data
        router.push("/dashboard");
      }
    }
  }, [state, router, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      {/* Success message */}
      {state?.status === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircledIcon className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            {state.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {state?.status === "error" && state.errors?._form && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{state.errors._form[0]}</AlertDescription>
        </Alert>
      )}

      {/* Project name field */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Project Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="My Awesome Project"
          required
          aria-invalid={state?.errors?.name ? "true" : undefined}
        />
        {state?.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Project description field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your project (optional)"
          rows={4}
          aria-invalid={state?.errors?.description ? "true" : undefined}
        />
        {state?.errors?.description && (
          <p className="text-sm text-destructive">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
