'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAppStore();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (user.role === 'super-admin') {
        router.push('/super-admin');
      } else if (user.role === 'org-admin') {
        router.push('/org-admin');
      } else if (user.role === 'league-admin') {
        router.push('/league-admin');
      } else if (user.role === 'event-admin') {
        router.push('/event-admin');
      } else if (user.role === 'club-admin') {
        router.push('/club-admin');
      } else if (user.role === 'referee') {
        router.push('/referee');
      } else {
        router.push('/auth/signin');
      }
    } else {
      router.push('/auth/signin');
    }
  }, [user, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center glass-card p-8 rounded-2xl max-w-md mx-4"
      >
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-2">Redirecting...</h2>
        <p className="text-muted-foreground">Taking you to your dashboard...</p>
      </motion.div>
    </div>
  );
}
