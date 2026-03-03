'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Users, Zap, Settings, Plus, Edit2, Calendar, Shield, Flag, Target, Award, Clock, MapPin, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { mockLeagues, mockMatches } from '@/lib/mock-data';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Dashboard', href: '/event-admin', icon: <BarChart3 size={20} /> },
  { label: 'Events', href: '/event-admin/events', icon: <Calendar size={20} /> },
  { label: 'Matches', href: '/event-admin/matches', icon: <Zap size={20} /> },
  { label: 'Teams', href: '/event-admin/teams', icon: <Users size={20} /> },
  { label: 'Referees', href: '/event-admin/referees', icon: <Shield size={20} /> },
  { label: 'Settings', href: '/event-admin/settings', icon: <Settings size={20} /> },
];

export default function EventAdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { user, leagues, setLeagues, matches, setMatches } = useAppStore();

  // Get the league that this admin manages
  const userLeague = leagues.find(league => {
    if (!user?.league) return false;
    if (typeof user.league === 'string') {
      return league._id === user.league || league.id === user.league;
    }
    return league._id === user.league._id || league.id === user.league._id;
  });

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

  // Mock stats for the event admin
  const stats = [
    {
      title: 'Total Events',
      value: '12',
      icon: '📅',
      trend: { value: 3, isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Active Matches',
      value: '8',
      icon: '⚽',
      trend: { value: 2, isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Assigned Referees',
      value: '6',
      icon: '👨‍⚖️',
      trend: { value: 1, isPositive: true },
      color: 'gold' as const,
    },
    {
      title: 'Total Attendance',
      value: '2.4K',
      icon: '👥',
      trend: { value: 15, isPositive: true },
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
          <p className="text-muted-foreground">Loading event dashboard...</p>
        </div>
      </div>
    );
  }

  if (!displayLeague) {
    return (
      <ProtectedRoute requiredRole="event-admin">
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
    <ProtectedRoute requiredRole="event-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="Event Admin"
          headerTitle={`${displayLeague.name} Event Management`}
          headerDescription="Oversee events, matches, and tournament operations"
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/event-admin/events/create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus size={20} />
              Create Event
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
                    <span className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm font-semibold">
                      Event Admin
                    </span>
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
                onClick={() => router.push('/event-admin/events')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Calendar className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Manage Events</h3>
                    <p className="text-sm text-muted-foreground">Create and organize tournaments</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/event-admin/matches')}
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
                    <p className="text-sm text-muted-foreground">Manage fixtures and results</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/event-admin/referees')}
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
                onClick={() => router.push('/event-admin/teams')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Users className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Team Management</h3>
                    <p className="text-sm text-muted-foreground">Register and organize teams</p>
                  </div>
                </div>
              </motion.button>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Upcoming Events</h3>
                <motion.button
                  onClick={() => router.push('/event-admin/events')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-accent hover:text-accent/80 font-semibold text-sm"
                >
                  View All →
                </motion.button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">Quarter Finals Tournament</h4>
                      <p className="text-sm text-muted-foreground">8 teams competing for semi-finals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-2">
                      <Clock size={16} />
                      Dec 15-20, 2024
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      Main Stadium
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                      Confirmed
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                      8 Teams
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Live Matches & Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Live Matches */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-red-500" size={20} />
                  Live Matches
                </h3>
                <div className="space-y-4">
                  {leagueMatches.filter(m => m.status === 'live').slice(0, 3).map((match) => (
                    <motion.div
                      key={match.id}
                      whileHover={{ x: 4 }}
                      className="p-4 bg-accent/10 rounded-lg border border-accent/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{match.homeTeam} vs {match.awayTeam}</span>
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold animate-pulse">
                          LIVE
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {match.homeScore} - {match.awayScore} • {match.venue}
                      </div>
                    </motion.div>
                  ))}
                  {leagueMatches.filter(m => m.status === 'live').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No live matches</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Results */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="text-green-500" size={20} />
                  Recent Results
                </h3>
                <div className="space-y-4">
                  {leagueMatches.filter(m => m.status === 'completed').slice(0, 3).map((match) => (
                    <motion.div
                      key={match.id}
                      whileHover={{ x: 4 }}
                      className="p-4 bg-card/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{match.homeTeam} vs {match.awayTeam}</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">
                          FINAL
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {match.homeScore} - {match.awayScore} • {new Date(match.date).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                  {leagueMatches.filter(m => m.status === 'completed').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No recent results</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
