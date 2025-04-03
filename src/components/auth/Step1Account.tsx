"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Dispatch, SetStateAction } from "react";
import type { RegisterInput } from "@/lib/validators"; // Use the inferred type

interface Step1AccountProps {
  formData: Partial<RegisterInput>; // Use partial as it's filled progressively
  setFormData: Dispatch<SetStateAction<Partial<RegisterInput>>>;
  nextStep: () => void;
  errors?: { email?: string[]; password?: string[] } | null;
}

export function Step1Account({
  formData,
  setFormData,
  nextStep,
  errors,
}: Step1AccountProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Basic validation check before proceeding (can be enhanced with Zod client-side)
  const canProceed = formData.email && formData.password && formData.password.length >= 8;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          value={formData.email || ""}
          onChange={handleChange}
          required
          aria-invalid={!!errors?.email}
          aria-describedby={errors?.email ? "email-error" : undefined}
        />
        {errors?.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password || ""}
          onChange={handleChange}
          required
          minLength={8}
           aria-invalid={!!errors?.password}
          aria-describedby={errors?.password ? "password-error" : undefined}
        />
         {errors?.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password[0]}
          </p>
        )}
      </div>
      <Button onClick={nextStep} disabled={!canProceed} className="w-full">
        Next
      </Button>
    </div>
  );
} 