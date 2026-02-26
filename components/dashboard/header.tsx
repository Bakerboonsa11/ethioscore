'use client';

import { ReactNode } from 'react';
import { Bell, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  notifications?: number;
}

export function Header({
  title,
  description,
  actions,
  notifications,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-card/80 backdrop-blur-lg border border-border rounded-lg shadow-lg border-b border-border sticky top-0 z-40"
    >
      <div className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {actions}

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell size={20} />
            {notifications && notifications > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold">
                {notifications}
              </span>
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings size={20} />
          </motion.button>

          {/* Profile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-secondary transition-colors"
          >
            <User size={20} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
