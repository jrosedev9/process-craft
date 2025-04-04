"use client";

import React, { useState } from "react";
import type { User } from "next-auth"; // Use Session['user'] if Session type is defined and exported
import Link from "next/link"; // Import Link for navigation
import { logoutAction } from "@/app/actions/auth.actions"; // Import the server action
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Home, LayoutDashboard, FolderKanban, Settings, LogOut, ChevronDown, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

interface HeaderProps {
  user: User | undefined; // Or Session['user'] | undefined
}

// Helper function to get user initials
const getUserInitials = (user: User | undefined): string => {
  if (!user || !user.email) return "U";
  return user.email.substring(0, 2).toUpperCase();
};

export default function Header({ user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-[var(--midnight-blue)] to-[#142c4c] text-white">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[var(--midnight-blue)] text-white border-r border-border">
              <div className="flex flex-col gap-6">
                <Link
                  href={user ? "/dashboard" : "/"}
                  className="font-bold text-xl tracking-tight inline-flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Process<span className="text-[var(--amber-orange)]">Craft</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm font-medium hover:text-[var(--amber-orange)] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Home className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/projects"
                        className="flex items-center gap-2 text-sm font-medium hover:text-[var(--amber-orange)] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FolderKanban className="h-4 w-4" />
                        Projects
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 text-sm font-medium hover:text-[var(--amber-orange)] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <form action={logoutAction}>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="w-full justify-start text-white hover:text-[var(--amber-orange)] hover:bg-transparent"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center gap-2 text-sm font-medium hover:text-[var(--amber-orange)] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center gap-2 text-sm font-medium text-[var(--amber-orange)] hover:text-[var(--amber-orange)]/80 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="font-bold text-xl tracking-tight inline-flex items-center">
            <div className="hidden sm:flex mr-1 h-8 w-8 rounded-md bg-[var(--amber-orange)] items-center justify-center text-white font-bold text-sm">PC</div>
            Process<span className="text-[var(--amber-orange)]">Craft</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {user && (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent text-white hover:bg-white/10 hover:text-white"
                  )}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10">
                  <FolderKanban className="h-4 w-4 mr-2" />
                  Projects
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[var(--midnight-blue)] to-[var(--midnight-blue)]/80 p-6 no-underline outline-none focus:shadow-md"
                          href="/projects"
                        >
                          <FolderKanban className="h-6 w-6 text-[var(--amber-orange)]" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            All Projects
                          </div>
                          <p className="text-sm leading-tight text-white/70">
                            View and manage all your projects in one place.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/projects/new"
                        >
                          <div className="text-sm font-medium leading-none">Create New Project</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Start a new project from scratch.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/projects?filter=recent"
                        >
                          <div className="text-sm font-medium leading-none">Recent Projects</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View your recently accessed projects.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/projects?filter=favorites"
                        >
                          <div className="text-sm font-medium leading-none">Favorite Projects</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Access your favorite projects quickly.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* User Menu or Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {/* Notifications Button */}
              <Button variant="ghost" size="icon" className="hidden md:flex text-white hover:bg-white/10 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--amber-orange)] text-[10px] flex items-center justify-center">3</span>
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-2 sm:pl-2 sm:pr-4">
                    <Avatar className="h-7 w-7 border border-white/20">
                      <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                      <AvatarFallback className="bg-[var(--amber-orange)]/10 text-[var(--amber-orange)]">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block text-sm font-medium truncate max-w-[100px]">
                      {user.name || user.email?.split('@')[0] || "User"}
                    </span>
                    <ChevronDown className="hidden sm:inline-block h-4 w-4 text-white/70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/projects">
                      <FolderKanban className="mr-2 h-4 w-4" />
                      <span>Projects</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={logoutAction} className="w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        className="w-full justify-start p-0 h-auto font-normal"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 hover:text-white">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild className="bg-[var(--amber-orange)] hover:bg-[var(--amber-orange)]/80">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}