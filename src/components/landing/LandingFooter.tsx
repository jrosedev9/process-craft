"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  ArrowUp 
} from "lucide-react";

export function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[var(--midnight-blue)] text-white">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="font-bold text-xl tracking-tight inline-flex items-center mb-4">
              <div className="mr-1 h-8 w-8 rounded-md bg-[var(--amber-orange)] items-center justify-center text-white font-bold text-sm flex">PC</div>
              Process<span className="text-[var(--amber-orange)]">Craft</span>
            </Link>
            <p className="text-white/70 mb-4">
              Modern project management for teams of all sizes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-white/70 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Guides</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} ProcessCraft. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
          
          <motion.button
            onClick={scrollToTop}
            className="mt-6 md:mt-0 bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
