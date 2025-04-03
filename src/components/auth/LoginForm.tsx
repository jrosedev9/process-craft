"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}

export function LoginForm() {
  // useActionState<State, Payload>
  const [errorMessage, formAction] = useActionState<
    string | undefined, // State type (error message)
    FormData // Payload type
  >(login, undefined); // Action function and initial state

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email" // Make sure name attribute is set for FormData
          type="email"
          placeholder="m@example.com"
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password" // Make sure name attribute is set for FormData
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      {errorMessage && (
        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
      )}
      <SubmitButton />
    </form>
  );
} 