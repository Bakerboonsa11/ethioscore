'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Trophy,
  Users,
  Zap,
  Shield,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Trophy,
    title: 'League Management',
    description: 'Create and manage multiple leagues with comprehensive tournament structures.',
  },
  {
    icon: Users,
    title: 'Team & Player Management',
    description: 'Track teams, players, and their performance across seasons.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Get actionable insights with advanced dashboards and reports.',
  },
  {
    icon: Zap,
    title: 'Live Match Updates',
    description: 'Update match scores and statistics in real-time.',
  },
  {
    icon: Shield,
    title: 'Secure Access Control',
    description: 'Role-based access for super admins and organization managers.',
  },
  {
    icon: TrendingUp,
    title: 'Performance Tracking',
    description: 'Monitor player and team performance metrics over time.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage Ethiopian football professionally
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-card/80 backdrop-blur-lg border border-border rounded-lg shadow-lg p-6 rounded-xl group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                  <Icon className="text-accent" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
