"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--midnight-blue)] to-[#142c4c] text-white py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--amber-orange)]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-[var(--sage-green)]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-6"
          >
            <Badge
              variant="outline"
              className="w-fit border-[var(--amber-orange)]/30 text-[var(--amber-orange)] bg-[var(--amber-orange)]/10 px-4 py-1"
            >
              Project Management Simplified
            </Badge>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Streamline Your <span className="text-[var(--amber-orange)]">Workflow</span> with ProcessCraft
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/80 max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              A modern project management tool designed to help teams collaborate, track progress, and deliver projects on time.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button size="lg" asChild className="bg-[var(--amber-orange)] hover:bg-[var(--amber-orange)]/90">
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 bg-white/5">
                <Link href="#how-it-works">
                  Learn More
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[var(--midnight-blue)] bg-gray-300"
                    style={{ zIndex: 5 - i }}
                  />
                ))}
              </div>
              <p className="text-sm text-white/70">
                <span className="font-semibold text-white">500+</span> teams already using ProcessCraft
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[var(--amber-orange)]"></div>
                    <div className="h-3 w-3 rounded-full bg-[var(--sage-green)]"></div>
                    <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                  </div>
                  <div className="text-xs text-white/50">ProcessCraft Dashboard</div>
                </div>

                <div className="space-y-4">
                  <div className="h-8 bg-white/10 rounded w-1/3"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-white/5 rounded border border-white/10 p-3">
                      <div className="h-3 w-1/2 bg-white/20 rounded mb-2"></div>
                      <div className="h-3 w-3/4 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 w-2/3 bg-white/10 rounded"></div>
                    </div>
                    <div className="h-24 bg-white/5 rounded border border-white/10 p-3">
                      <div className="h-3 w-1/2 bg-white/20 rounded mb-2"></div>
                      <div className="h-3 w-3/4 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 w-2/3 bg-white/10 rounded"></div>
                    </div>
                    <div className="h-24 bg-white/5 rounded border border-white/10 p-3">
                      <div className="h-3 w-1/2 bg-white/20 rounded mb-2"></div>
                      <div className="h-3 w-3/4 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 w-2/3 bg-white/10 rounded"></div>
                    </div>
                  </div>
                  <div className="h-32 bg-white/5 rounded border border-white/10 p-4">
                    <div className="flex justify-between mb-2">
                      <div className="h-3 w-1/4 bg-white/20 rounded"></div>
                      <div className="h-3 w-1/6 bg-[var(--amber-orange)]/50 rounded"></div>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded mb-2 overflow-hidden">
                      <div className="h-full w-2/3 bg-[var(--amber-orange)]/40 rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="h-3 w-full bg-white/10 rounded"></div>
                      <div className="h-3 w-full bg-white/10 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-6 -right-6 bg-[var(--sage-green)] text-white p-3 rounded-lg shadow-lg flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Task Completed</span>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-white text-[var(--midnight-blue)] p-3 rounded-lg shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="text-sm font-medium">Project Progress</div>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                <div className="w-3/4 h-2 bg-[var(--amber-orange)] rounded-full"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
