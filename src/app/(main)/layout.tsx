import React from "react";
import { auth } from "@/auth"; // Correct import for auth()
import Header from "@/components/shared/Header"; // We will create this next
// import Sidebar from "@/components/shared/Sidebar"; // Placeholder for potential sidebar
import { Toaster } from "@/components/ui/toaster";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // Could redirect here if !session, but middleware is generally preferred

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={session?.user} />
      <div className="flex flex-1">
        {/* <Sidebar /> */} {/* Placeholder for a potential sidebar */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      {/* <Footer /> */} {/* Optional: Placeholder for a footer */}
      <Toaster />
    </div>
  );
}