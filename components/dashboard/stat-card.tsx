'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'green' | 'blue' | 'gold' | 'red';
  delay?: number;
}

const colorClasses = {
  green: 'from-primary/20 to-primary/10 border-primary/30',
  blue: 'from-secondary/20 to-secondary/10 border-secondary/30',
  gold: 'from-accent/20 to-accent/10 border-accent/30',
  red: 'from-destructive/20 to-destructive/10 border-destructive/30',
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  color = 'green',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-card/80 backdrop-blur-lg border border-border rounded-lg shadow-lg p-6 bg-gradient-to-br ${colorClasses[color]} hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-2 font-semibold ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className="text-3xl opacity-60">{icon}</div>
      </div>
    </motion.div>
  );
}
