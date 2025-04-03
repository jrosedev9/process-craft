"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";

import { registerUser } from "@/app/actions/auth.actions";
import type { RegisterState } from "@/app/actions/auth.actions";
import type { RegisterInput } from "@/lib/validators";
import { Step1Account } from "./Step1Account";
import { Step2Profile } from "./Step2Profile";

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegisterInput>>({});

  const [state, formAction, isPending] = useActionState<RegisterState, FormData>(
    registerUser,
    null
  );

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const step1Errors = (state?.status === 'error' && step === 1) ? state.errors : null;
  const step2Errors = (state?.status === 'error' && step === 2) ? state.errors : null;
  const formError = (state?.status === 'error' && state.errors?._form) ? state.errors._form[0] : null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Step {step} of 2: {step === 1 ? "Account Details" : "Profile Information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {formError && !isPending && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Registration Failed</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          {state?.status === 'success' && !isPending && (
            <Alert variant="default" className="mb-4 border-green-500 text-green-700 dark:border-green-600 dark:text-green-400">
              <CheckCircledIcon className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {state?.status !== 'success' && (
            <>
              {step === 1 && (
                <Step1Account
                  formData={formData}
                  setFormData={setFormData}
                  nextStep={nextStep}
                  errors={step1Errors}
                />
              )}
              {step === 2 && (
                <Step2Profile
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={prevStep}
                  isPending={isPending}
                  errors={step2Errors}
                />
              )}
              {step === 2 && Object.entries(formData).map(([key, value]) => (
                value !== undefined && value !== null && !['name'].includes(key)
                  ? <input key={key} type="hidden" name={key} value={String(value)} />
                  : null
              ))}
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 