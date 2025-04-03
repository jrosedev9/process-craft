"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Dispatch, SetStateAction } from "react";
import type { RegisterInput } from "@/lib/validators";

interface Step2ProfileProps {
  formData: Partial<RegisterInput>;
  setFormData: Dispatch<SetStateAction<Partial<RegisterInput>>>;
  prevStep: () => void;
  isPending: boolean;
  errors?: { name?: string[] } | null;
}

export function Step2Profile({
  formData,
  setFormData,
  prevStep,
  isPending,
  errors,
}: Step2ProfileProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   // Basic validation check
  const canSubmit = formData.name && formData.name.length >= 2;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Your Name"
          value={formData.name || ""}
          onChange={handleChange}
          required
          minLength={2}
          aria-invalid={!!errors?.name}
          aria-describedby={errors?.name ? "name-error" : undefined}
        />
         {errors?.name && (
          <p id="name-error" className="text-sm text-destructive">
            {errors.name[0]}
          </p>
        )}
      </div>
      <div className="flex justify-between space-x-2">
        <Button type="button" onClick={prevStep} variant="outline" disabled={isPending}>
          Back
        </Button>
        <Button type="submit" disabled={!canSubmit || isPending} className="flex-grow">
          {isPending ? "Registering..." : "Register"}
        </Button>
      </div>
    </div>
  );
} 