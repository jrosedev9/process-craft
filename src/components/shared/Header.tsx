"use client";

import React from "react";
import type { User } from "next-auth"; // Use Session['user'] if Session type is defined and exported
import Link from "next/link"; // Import Link for navigation
import { logoutAction } from "@/app/actions/auth.actions"; // Import the server action
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user: User | undefined; // Or Session['user'] | undefined
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <div>
        {/* Placeholder for Logo or Site Title */}
        <Link href={user ? "/dashboard" : "/"} className="font-semibold">
          ProcessCraft
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email ?? "User"}
            </span>
            <form action={logoutAction}>
              <Button variant="outline" size="sm" type="submit">
                Logout
              </Button>
            </form>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
} 