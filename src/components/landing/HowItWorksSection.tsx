"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Workspace",
    description: "Sign up and create your first project workspace in seconds. No complex setup required."
  },
  {
    number: "02",
    title: "Invite Your Team",
    description: "Add team members and assign roles to collaborate effectively on your projects."
  },
  {
    number: "03",
    title: "Set Up Your Projects",
    description: "Create projects, define milestones, and break down work into manageable tasks."
  },
  {
    number: "04",
    title: "Track Progress",
    description: "Monitor progress in real-time with visual boards and detailed analytics."
  }
];

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--dark-charcoal)]">
            How ProcessCraft Works
          </h2>
          <p className="text-lg text-[var(--dark-charcoal)]/70 max-w-2xl mx-auto">
            Get started in minutes with our simple four-step process
          </p>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* Progress Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2 md:translate-x-0">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-[var(--amber-orange)]"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-12 md:space-y-24 relative">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-8 md:gap-16`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                {/* Step Number */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[var(--amber-orange)] text-white flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 ${
                  index % 2 === 0 ? "md:text-left" : "md:text-right"
                }`}>
                  <h3 className="text-2xl font-bold mb-3 text-[var(--dark-charcoal)]">{step.title}</h3>
                  <p className="text-[var(--dark-charcoal)]/70 max-w-md">{step.description}</p>
                  
                  <div className={`mt-4 flex ${
                    index % 2 === 0 ? "" : "md:justify-end"
                  }`}>
                    <div className="flex items-center gap-2 text-sm text-[var(--sage-green)] font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Quick and easy</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
