'use client';

import Link from 'next/link';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <GradientBackground />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-primary-foreground" />
            </div>
            <span>EthioScore</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <button className="text-foreground hover:text-accent transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <HeroSection />
      <FeaturesSection />

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-lg py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">EthioScore</h3>
              <p className="text-muted-foreground">
                Powering Ethiopian football digitally.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="#" className="hover:text-accent">Features</Link></li>
                <li><Link href="#" className="hover:text-accent">Pricing</Link></li>
                <li><Link href="#" className="hover:text-accent">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="#" className="hover:text-accent">About</Link></li>
                <li><Link href="#" className="hover:text-accent">Blog</Link></li>
                <li><Link href="#" className="hover:text-accent">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="#" className="hover:text-accent">Privacy</Link></li>
                <li><Link href="#" className="hover:text-accent">Terms</Link></li>
                <li><Link href="#" className="hover:text-accent">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm">
              © 2024 EthioScore. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-accent">
                Twitter
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent">
                Facebook
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
