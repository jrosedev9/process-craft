"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Kanban, 
  Clock, 
  BarChart3, 
  Users, 
  Bell, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: <Kanban className="h-6 w-6" />,
    title: "Kanban Boards",
    description: "Visualize your workflow with customizable Kanban boards to track progress at a glance."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Time Tracking",
    description: "Monitor time spent on tasks and projects to improve productivity and resource allocation."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Analytics",
    description: "Gain insights with detailed analytics and reports to make data-driven decisions."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Collaboration",
    description: "Seamless collaboration tools to keep your team connected and aligned on project goals."
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: "Notifications",
    description: "Stay updated with real-time notifications for task assignments and project updates."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security to keep your project data safe and accessible when you need it."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-[var(--soft-gray)]">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--dark-charcoal)]">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-lg text-[var(--dark-charcoal)]/70 max-w-2xl mx-auto">
            Everything you need to manage projects efficiently and keep your team on the same page.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--amber-orange)]/10 text-[var(--amber-orange)] flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--dark-charcoal)]">{feature.title}</h3>
              <p className="text-[var(--dark-charcoal)]/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
