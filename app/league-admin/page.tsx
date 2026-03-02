'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Users, Zap, Settings, Plus, Edit2, Calendar, Shield, Flag, Target, Award } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { mockLeagues, mockMatches } from '@/lib/mock-data';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/league-admin', icon: <BarChart3 size={20} /> },
  { label: 'Teams', href: '/league-admin/teams', icon: <Users size={20} /> },
  { label: 'Matches', href: '/league-admin/matches', icon: <Zap size={20} /> },
  { label: 'Referees', href: '/league-admin/referees', icon: <Shield size={20} /> },
  { label: 'Settings', href: '/league-admin/settings', icon: <Settings size={20} /> },
];

export default function LeagueAdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { user, leagues, setLeagues, matches, setMatches } = useAppStore();

  // Get the league that this admin manages
  const userLeague = leagues.find(league =>
    league._id === user?.league?._id || league.id === user?.league?.id
  );

  // TEMPORARY: Use first league as fallback for testing
  const displayLeague = userLeague || leagues[0];

  useEffect(() => {
    // Load leagues and matches if not already loaded
    if (!leagues.length) {
      setLeagues(mockLeagues);
    }
    if (!matches.length) {
      setMatches(mockMatches);
    }
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [leagues.length, matches.length, setLeagues, setMatches]);

  // Mock stats for the league
  const stats = [
    {
      title: 'Registered Teams',
      value: '16',
      icon: '⚽',
      trend: { value: 2, isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Total Matches',
      value: '48',
      icon: '📅',
      trend: { value: 4, isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Active Referees',
      value: '8',
      icon: '👨‍⚖️',
      trend: { value: 1, isPositive: true },
      color: 'gold' as const,
    },
    {
      title: 'Total Players',
      value: '320',
      icon: '👥',
      trend: { value: 12, isPositive: true },
      color: 'red' as const,
    },
  ];

  // Mock recent matches for this league
  const leagueMatches = matches.filter(match =>
    match.leagueId === displayLeague?.id || match.leagueId === displayLeague?._id
  ).slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading league dashboard...</p>
        </div>
      </div>
    );
  }

  if (!displayLeague) {
    return (
      <ProtectedRoute requiredRole="league-admin">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center glass-card p-8 rounded-2xl max-w-md mx-4">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Loading League Data...</h2>
            <p className="text-muted-foreground mb-6">
              Please wait while we load your league information.
            </p>
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
          headerTitle={`${displayLeague.name} Dashboard`}
          headerDescription="Manage your league's teams, matches, and operations"
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/league-admin/matches/create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus size={20} />
              Schedule Match
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* League Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center text-4xl">
                  🏆
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{displayLeague.name}</h2>
                  <div className="flex items-center gap-6 text-muted-foreground mb-4">
                    <span className="flex items-center gap-2">
                      <Calendar size={18} />
                      {displayLeague.year}
                    </span>
                    <span className="flex items-center gap-2">
                      <Target size={18} />
                      {displayLeague.type?.format || 'League'}
                    </span>
                    {displayLeague.region && (
                      <span className="flex items-center gap-2">
                        📍 {displayLeague.region}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      displayLeague.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : displayLeague.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {displayLeague.status.charAt(0).toUpperCase() + displayLeague.status.slice(1)}
                    </span>
                    {displayLeague.tier && (
                      <span className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm font-semibold">
                        Tier {displayLeague.tier}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.button
                onClick={() => router.push('/league-admin/teams')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Users className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Manage Teams</h3>
                    <p className="text-sm text-muted-foreground">Add, edit, and organize teams</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/league-admin/matches')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Zap className="text-green-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Schedule Matches</h3>
                    <p className="text-sm text-muted-foreground">Create and manage fixtures</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/league-admin/referees')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                    <Shield className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Assign Referees</h3>
                    <p className="text-sm text-muted-foreground">Manage match officials</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/league-admin/settings')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Settings className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">League Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure league preferences</p>
                  </div>
                </div>
              </motion.button>
            </motion.div>

            {/* Recent Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Recent Matches</h3>
                <motion.button
                  onClick={() => router.push('/league-admin/matches')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-accent hover:text-accent/80 font-semibold text-sm"
                >
                  View All →
                </motion.button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {leagueMatches.length > 0 ? leagueMatches.map((match) => (
                  <motion.div
                    key={match.id}
                    whileHover={{ x: 4 }}
                    className="glass-card p-6 rounded-xl flex items-center justify-between hover:shadow-lg transition-shadow"
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
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(match.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flag size={14} />
                          {match.venue || 'TBD'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          match.status === 'live'
                            ? 'bg-red-500/20 text-red-400 animate-pulse'
                            : match.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                      <motion.button
                        onClick={() => router.push(`/league-admin/matches/${match.id}`)}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 hover:bg-card rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-muted-foreground" />
                      </motion.button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="glass-card p-8 rounded-xl text-center">
                    <Zap size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h4 className="font-semibold mb-2">No Matches Scheduled</h4>
                    <p className="text-muted-foreground mb-4">Start by scheduling your first match</p>
                    <motion.button
                      onClick={() => router.push('/league-admin/matches/create')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
                    >
                      Schedule First Match
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* League Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h3 className="text-xl font-bold mb-6">League Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="text-green-500" size={24} />
                  </div>
                  <h4 className="font-semibold mb-1">Round 3 of 8</h4>
                  <p className="text-sm text-muted-foreground">Current match week</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="text-blue-500" size={24} />
                  </div>
                  <h4 className="font-semibold mb-1">24 Matches</h4>
                  <p className="text-sm text-muted-foreground">Completed this season</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="text-orange-500" size={24} />
                  </div>
                  <h4 className="font-semibold mb-1">6 Weeks</h4>
                  <p className="text-sm text-muted-foreground">Remaining in season</p>
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
