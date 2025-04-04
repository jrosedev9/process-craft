"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

type SectionId = "features" | "how-it-works" | "testimonials" | "cta";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Determine active section based on scroll position
      const sections = [
        { id: "features", element: document.getElementById("features") },
        { id: "how-it-works", element: document.getElementById("how-it-works") },
        { id: "testimonials", element: document.getElementById("testimonials") },
        { id: "cta", element: document.getElementById("cta") }
      ];

      const currentSection = sections.find(section => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      setActiveSection(currentSection ? currentSection.id as SectionId : null);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }

    const section = document.getElementById(sectionId);
    if (section) {
      // Close mobile menu if open
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }

      // Get the target position
      const targetPosition = section.offsetTop - 80; // Offset for header height
      const startPosition = window.scrollY; // Modern alternative to pageYOffset
      const distance = targetPosition - startPosition;

      // Create a smoother animation with framer-motion
      const duration = 0.8; // seconds
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsedTime = (currentTime - startTime) / 1000; // convert to seconds

        if (elapsedTime > duration) {
          window.scrollTo(0, targetPosition);
          return;
        }

        // Easing function for smoother animation
        const easeInOutCubic = (t: number) => {
          return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const progress = easeInOutCubic(elapsedTime / duration);
        const currentPosition = startPosition + distance * progress;

        window.scrollTo(0, currentPosition);
        requestAnimationFrame(animateScroll);
      };

      requestAnimationFrame(animateScroll);
    }
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--midnight-blue)]/95 backdrop-blur-md shadow-md"
          : "bg-[var(--midnight-blue)]/80 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="#" className="font-bold text-xl tracking-tight inline-flex items-center text-white">
          <div className="mr-1 h-8 w-8 rounded-md bg-[var(--amber-orange)] items-center justify-center text-white font-bold text-sm flex">PC</div>
          Process<span className="text-[var(--amber-orange)]">Craft</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <a
              href="#features"
              onClick={(e) => scrollToSection("features", e)}
              className={`text-white/80 hover:text-white transition-colors ${activeSection === "features" ? "text-white font-medium" : ""}`}
            >
              Features
              {activeSection === "features" && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--amber-orange)]"
                  layoutId="activeSection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </a>
          </div>
          <div className="relative">
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection("how-it-works", e)}
              className={`text-white/80 hover:text-white transition-colors ${activeSection === "how-it-works" ? "text-white font-medium" : ""}`}
            >
              How It Works
              {activeSection === "how-it-works" && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--amber-orange)]"
                  layoutId="activeSection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </a>
          </div>
          <div className="relative">
            <a
              href="#testimonials"
              onClick={(e) => scrollToSection("testimonials", e)}
              className={`text-white/80 hover:text-white transition-colors ${activeSection === "testimonials" ? "text-white font-medium" : ""}`}
            >
              Testimonials
              {activeSection === "testimonials" && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--amber-orange)]"
                  layoutId="activeSection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </a>
          </div>
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="default" size="sm" asChild className="bg-[var(--amber-orange)] hover:bg-[var(--amber-orange)]/80">
            <Link href="/register">Register</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-[var(--midnight-blue)] border-t border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a
              href="#features"
              className={`text-white/80 hover:text-white transition-colors py-2 ${activeSection === "features" ? "text-white font-medium" : ""}`}
              onClick={(e) => scrollToSection("features", e)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`text-white/80 hover:text-white transition-colors py-2 ${activeSection === "how-it-works" ? "text-white font-medium" : ""}`}
              onClick={(e) => scrollToSection("how-it-works", e)}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className={`text-white/80 hover:text-white transition-colors py-2 ${activeSection === "testimonials" ? "text-white font-medium" : ""}`}
              onClick={(e) => scrollToSection("testimonials", e)}
            >
              Testimonials
            </a>
            <div className="flex flex-col space-y-2 pt-2 border-t border-white/10">
              <Button variant="ghost" size="sm" asChild className="justify-start text-white hover:bg-white/10">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild className="justify-start bg-[var(--amber-orange)] hover:bg-[var(--amber-orange)]/80">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
