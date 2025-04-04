"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

export function CTASection() {
  return (
    <section id="cta" className="py-20 bg-[var(--soft-gray)]">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          className="bg-gradient-to-r from-[var(--midnight-blue)] to-[#142c4c] rounded-2xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative px-6 py-12 md:p-12 lg:p-16">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--amber-orange)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--sage-green)]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex-1">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Ready to Transform Your <span className="text-[var(--amber-orange)]">Project Management</span>?
                </motion.h2>

                <motion.p
                  className="text-lg text-white/80 mb-8 max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Join thousands of teams who have improved their productivity and project outcomes with ProcessCraft.
                </motion.p>

                <motion.div
                  className="space-y-3 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {[
                    "Free 14-day trial, no credit card required",
                    "Unlimited projects during trial period",
                    "Full access to all features"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[var(--amber-orange)]" />
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button size="lg" asChild className="bg-[var(--amber-orange)] hover:bg-[var(--amber-orange)]/90">
                    <Link href="/register">
                      Get Started Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <motion.div
                className="flex-shrink-0 w-full max-w-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-white">Start for Free</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Basic Plan</span>
                      <span className="text-[var(--amber-orange)] font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Pro Plan</span>
                      <span className="text-white font-semibold">$12/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Team Plan</span>
                      <span className="text-white font-semibold">$49/month</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-white/60 mb-4">
                      All plans include a 14-day free trial with full access to all features.
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full border-white/20 text-white hover:bg-white/10 bg-white/5">
                      <Link href="/register">
                        Start Free Trial
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
