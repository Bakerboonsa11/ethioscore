'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';

export default function LeagueAdminTestPage() {
  return (
    <ProtectedRoute requiredRole="league-admin">
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">League Admin Test</h1>
          <p className="text-xl">If you can see this, routing is working!</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
