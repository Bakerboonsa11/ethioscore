'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-gradient" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-gradient" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent text-accent font-semibold text-sm">
              🇪🇹 Powering Ethiopian Football
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-balance leading-tight"
          >
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-accent via-primary to-secondary">
              Digitally Transform
            </span>
            <br />
            Your Football League
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            EthioScore is the all-in-one platform for managing Ethiopian football leagues,
            clubs, matches, and players. Streamline operations with real-time analytics
            and professional tools.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link href="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(242, 201, 76, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg bg-accent text-accent-foreground font-bold flex items-center gap-2 justify-center w-full sm:w-auto hover:shadow-lg transition-shadow"
              >
                Register Organization
                <ArrowRight size={20} />
              </motion.button>
            </Link>

            <Link href="/auth/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg bg-card border border-border text-foreground font-bold w-full sm:w-auto hover:bg-card/80 transition-colors"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="pt-8 grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto"
          >
            {[
              { value: '100+', label: 'Organizations' },
              { value: '500+', label: 'Leagues' },
              { value: '5000+', label: 'Matches' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
