"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "ProcessCraft has transformed how our team collaborates. The intuitive interface and powerful features have boosted our productivity by 30%.",
    author: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    rating: 5
  },
  {
    quote: "We've tried many project management tools, but ProcessCraft stands out with its simplicity and effectiveness. It's become essential to our workflow.",
    author: "Michael Chen",
    role: "CTO at StartupX",
    rating: 5
  },
  {
    quote: "The analytics features have given us insights we never had before. Now we can make data-driven decisions that improve our project outcomes.",
    author: "Emily Rodriguez",
    role: "Team Lead at DesignHub",
    rating: 4
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-[var(--midnight-blue)] to-[#142c4c] text-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Join hundreds of satisfied teams who have improved their workflow with ProcessCraft
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-[var(--amber-orange)]/20" />
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? "text-[var(--amber-orange)]"
                        : "text-gray-400"
                    }`}
                    fill={i < testimonial.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              
              <p className="text-white/90 mb-6 relative z-10">"{testimonial.quote}"</p>
              
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-white/60">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 text-white/80">
            <span className="text-4xl font-bold text-[var(--amber-orange)]">500+</span>
            <span className="text-xl">Teams using ProcessCraft daily</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
