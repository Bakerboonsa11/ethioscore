'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Plus, Edit2, Users, Award, Calendar, Star, Mail, User } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/league-admin', icon: <Shield size={20} /> },
  { label: 'Teams', href: '/league-admin/teams', icon: <Users size={20} /> },
  { label: 'Matches', href: '/league-admin/matches', icon: <Shield size={20} /> },
  { label: 'Referees', href: '/league-admin/referees', icon: <Shield size={20} /> },
  { label: 'Settings', href: '/league-admin/settings', icon: <Users size={20} /> },
];

export default function LeagueAdminRefereesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { user, leagues } = useAppStore();

  // Get the league that this admin manages
  const userLeague = leagues.find(league =>
    league._id === (typeof user?.league === 'string' ? user.league : user?.league?._id)
  );

  const [referees, setReferees] = useState<any[]>([]);

  useEffect(() => {
    const fetchReferees = async () => {
      if (!userLeague) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users?role=referee&leagueId=${userLeague._id || userLeague.id}`);
        if (response.ok) {
          const data = await response.json();
          setReferees(data);
        }
      } catch (error) {
        console.error('Error fetching referees:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferees();
  }, [userLeague]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading referees...</p>
        </div>
      </div>
    );
  }

  if (!userLeague) {
    return (
      <ProtectedRoute requiredRole="league-admin">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">League Not Found</h2>
            <p className="text-muted-foreground">You are not assigned to any league.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="league-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="League Admin"
          headerTitle="Referee Management"
          headerDescription={`Manage referees for ${userLeague.name}`}
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/league-admin/referees/add')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus size={20} />
              Add Referee
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* Referee Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="text-blue-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{referees.length}</h3>
                <p className="text-muted-foreground text-sm">Total Referees</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="text-green-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {referees.length > 0 ? Math.ceil(referees.length * 0.3) : 0}
                </h3>
                <p className="text-muted-foreground text-sm">Elite Referees</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="text-orange-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {referees.length * 25}
                </h3>
                <p className="text-muted-foreground text-sm">Total Matches</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="text-purple-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {referees.length > 0 ? '4.5' : '0.0'}
                </h3>
                <p className="text-muted-foreground text-sm">Avg Rating</p>
              </div>
            </motion.div>

            {/* Referees Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold">League Referees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {referees.length > 0 ? referees.map((referee, i) => (
                  <motion.div
                    key={referee._id || referee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="glass-card p-6 rounded-xl group hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield className="text-white" size={24} />
                      </div>
                      <motion.button
                        onClick={() => router.push(`/league-admin/referees/${referee._id || referee.id}/edit`)}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 hover:bg-card rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-muted-foreground" />
                      </motion.button>
                    </div>

                    <h4 className="text-lg font-bold mb-2">{referee.name || referee.username}</h4>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <p className="flex items-center gap-2">
                        <Mail size={14} />
                        {referee.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <User size={14} />
                        @{referee.username}
                      </p>
                      {referee.phone && (
                        <p className="flex items-center gap-2">
                          <Shield size={14} />
                          {referee.phone}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500 fill-current" size={16} />
                        <span className="font-semibold">4.5</span>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">
                        {userLeague?.name || 'League'}
                      </span>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <Shield size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h4 className="font-semibold mb-2">No Referees Found</h4>
                    <p className="text-muted-foreground mb-4">Start by adding your first referee</p>
                  </div>
                )}

                {/* Add New Referee Card */}
                <motion.button
                  onClick={() => router.push('/league-admin/referees/add')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + referees.length * 0.1 }}
                  className="glass-card p-6 rounded-xl flex items-center justify-center min-h-48 hover:border-accent transition-colors border border-border hover:border-accent"
                >
                  <div className="text-center">
                    <Plus size={32} className="text-accent mx-auto mb-2" />
                    <p className="font-semibold">Add Referee</p>
                    <p className="text-sm text-muted-foreground">Register a new referee</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Referee Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h3 className="text-xl font-bold mb-6">Referee Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="text-green-500" size={24} />
                  </div>
                  <h4 className="font-semibold mb-1">98.5%</h4>
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="text-blue-500" size={24} />
                  </div>
                  <h4 className="font-semibold mb-1">4.7/5</h4>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="text-orange-500" size={24} />
                  </div>
                  <h4 className="font-semibold mb-1">156</h4>
                  <p className="text-sm text-muted-foreground">Matches This Season</p>
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
