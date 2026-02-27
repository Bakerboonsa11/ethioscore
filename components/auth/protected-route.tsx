'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super-admin' | 'org-admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user } = useAppStore();

  useEffect(() => {
    // If no user is logged in, redirect to signin
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    // If user doesn't have required role, redirect to appropriate dashboard or signin
    if (requiredRole && user.role !== requiredRole) {
      if (user.role === 'super-admin') {
        router.push('/super-admin');
      } else if (user.role === 'org-admin') {
        router.push('/org-admin');
      } else {
        router.push('/auth/signin');
      }
      return;
    }
  }, [user, requiredRole, router]);

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-8 rounded-2xl max-w-md mx-4"
        >
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-8 rounded-2xl max-w-md mx-4"
        >
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2 text-red-400">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
