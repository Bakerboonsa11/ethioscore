'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Users, Zap, Settings, Plus, Edit2, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { mockLeagues, mockMatches } from '@/lib/mock-data';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/org-admin', icon: <BarChart3 size={20} /> },
  { label: 'Leagues', href: '/org-admin/leagues', icon: <Trophy size={20} /> },
  { label: 'Matches', href: '/org-admin/matches', icon: <Zap size={20} /> },
  { label: 'Settings', href: '/org-admin/settings', icon: <Settings size={20} /> },
];

export default function OrgAdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { leagues, setLeagues, matches, setMatches } = useAppStore();

  useEffect(() => {
    setLeagues(mockLeagues);
    setMatches(mockMatches);
    setIsLoading(false);
  }, [setLeagues, setMatches]);

  const stats = [
    {
      title: 'Active Leagues',
      value: mockLeagues.filter((l) => l.status === 'active').length,
      icon: '🏆',
      trend: { value: 3, isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Total Clubs',
      value: '48',
      icon: '⚽',
      trend: { value: 8, isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Matches This Week',
      value: '12',
      icon: '📅',
      trend: { value: 2, isPositive: false },
      color: 'gold' as const,
    },
    {
      title: 'Registered Players',
      value: '1,240',
      icon: '👥',
      trend: { value: 45, isPositive: true },
      color: 'red' as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading organization dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="org-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="Organization Admin"
          headerTitle="Dashboard"
          headerDescription="Manage your organization's leagues and matches"
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/org-admin/leagues/create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus size={20} />
              New League
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, i) => (
                <StatCard
                  key={i}
                  {...stat}
                  delay={i * 0.1}
                />
              ))}
          </motion.div>

          {/* Leagues Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold">Active Leagues</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leagues.map((league, i) => (
                <motion.div
                  key={league.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="glass-card p-6 rounded-xl group hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Trophy className="text-primary" size={24} />
                    </div>
                    <motion.button
                      onClick={() => router.push('/org-admin/leagues')}
                      whileHover={{ scale: 1.1 }}
                      className="p-2 hover:bg-card rounded-lg transition-colors"
                    >
                      <Edit2 size={18} className="text-muted-foreground" />
                    </motion.button>
                  </div>

                  <h4 className="text-lg font-bold mb-2">{league.name}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>Year: {league.year}</p>
                    <p>Format: {league.type?.format || 'N/A'}</p>
                    {league.region && <p>Region: {league.region}</p>}
                  </div>

                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        league.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : league.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {league.status.charAt(0).toUpperCase() + league.status.slice(1)}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Create New League Card */}
              <motion.button
                onClick={() => router.push('/org-admin/leagues/create')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + leagues.length * 0.1 }}
                className="glass-card p-6 rounded-xl flex items-center justify-center min-h-40 hover:border-accent transition-colors border border-border hover:border-accent"
              >
                <div className="text-center">
                  <Plus size={32} className="text-accent mx-auto mb-2" />
                  <p className="font-semibold">Create New League</p>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Recent Matches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold">Recent Matches</h3>
            <div className="grid grid-cols-1 gap-4">
              {matches.slice(0, 5).map((match) => (
                <motion.div
                  key={match.id}
                  whileHover={{ x: 4 }}
                  className="glass-card p-6 rounded-xl flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-semibold text-foreground">{match.homeTeam}</span>
                      <span className="text-2xl font-bold text-accent">
                        {match.homeScore}
                      </span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-2xl font-bold text-accent">
                        {match.awayScore}
                      </span>
                      <span className="font-semibold text-foreground">{match.awayTeam}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={16} />
                      {new Date(match.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      match.status === 'live'
                        ? 'bg-red-500/20 text-red-400 animate-pulse'
                        : match.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </div>
  </ProtectedRoute>
  );
}
