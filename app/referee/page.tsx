'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Users, Zap, Settings, Plus, Edit2, Calendar, Shield, Flag, Target, Award, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { mockLeagues, mockMatches } from '@/lib/mock-data';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Dashboard', href: '/referee', icon: <BarChart3 size={20} /> },
  { label: 'My Matches', href: '/referee/matches', icon: <Calendar size={20} /> },
  { label: 'Availability', href: '/referee/availability', icon: <Clock size={20} /> },
  { label: 'Performance', href: '/referee/performance', icon: <Award size={20} /> },
  { label: 'Profile', href: '/referee/profile', icon: <Users size={20} /> },
];

export default function RefereePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { user, leagues, setLeagues, matches, setMatches } = useAppStore();

  // Get the league that this referee belongs to
  const leagueRef = user?.league;
  const userLeague = leagues.find(league => {
    if (typeof leagueRef === 'object' && leagueRef) {
      return league._id === leagueRef._id;
    } else if (typeof leagueRef === 'string') {
      return league._id === leagueRef || league.id === leagueRef;
    }
    return false;
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

  // Mock stats for the referee
  const stats = [
    {
      title: 'Matches Officiated',
      value: '24',
      icon: '⚽',
      trend: { value: 4, isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Average Rating',
      value: '4.7',
      icon: '⭐',
      trend: { value: 0.2, isPositive: true },
      color: 'gold' as const,
    },
    {
      title: 'This Month',
      value: '6',
      icon: '📅',
      trend: { value: 2, isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Total Hours',
      value: '72',
      icon: '⏱️',
      trend: { value: 8, isPositive: true },
      color: 'red' as const,
    },
  ];

  // Mock upcoming matches for this referee
  const refereeMatches = matches.filter(match =>
    match.leagueId === displayLeague?.id || match.leagueId === displayLeague?._id
  ).slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading referee dashboard...</p>
        </div>
      </div>
    );
  }

  if (!displayLeague) {
    return (
      <ProtectedRoute requiredRole="referee">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center glass-card p-8 rounded-2xl max-w-md mx-4">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
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
    <ProtectedRoute requiredRole="referee">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="Referee Dashboard"
          headerTitle={`Welcome back, ${user?.name || user?.username || 'Referee'}`}
          headerDescription="Manage your matches, availability, and performance"
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/referee/availability')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Clock size={20} />
              Update Availability
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* Profile Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center text-4xl">
                  👨‍⚖️
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{user?.name || user?.username}</h2>
                  <div className="flex items-center gap-6 text-muted-foreground mb-4">
                    <span className="flex items-center gap-2">
                      <Shield size={18} />
                      Professional Referee
                    </span>
                    <span className="flex items-center gap-2">
                      <Trophy size={18} />
                      {displayLeague.name}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
                      Active Status
                    </span>
                    <span className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm font-semibold">
                      ⭐ 4.7 Rating
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
                onClick={() => router.push('/referee/matches')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Calendar className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">My Matches</h3>
                    <p className="text-sm text-muted-foreground">View assigned fixtures</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/referee/availability')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Clock className="text-green-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Set Availability</h3>
                    <p className="text-sm text-muted-foreground">Manage your schedule</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/referee/performance')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                    <Award className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Performance</h3>
                    <p className="text-sm text-muted-foreground">View ratings & stats</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/referee/profile')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Users className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">My Profile</h3>
                    <p className="text-sm text-muted-foreground">Update information</p>
                  </div>
                </div>
              </motion.button>
            </motion.div>

            {/* Upcoming Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Upcoming Matches</h3>
                <motion.button
                  onClick={() => router.push('/referee/matches')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-accent hover:text-accent/80 font-semibold text-sm"
                >
                  View All →
                </motion.button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {refereeMatches.length > 0 ? refereeMatches.map((match) => (
                  <motion.div
                    key={match.id}
                    whileHover={{ x: 4 }}
                    className="glass-card p-6 rounded-xl flex items-center justify-between hover:shadow-lg transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-semibold text-foreground">{match.homeTeam}</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="font-semibold text-foreground">{match.awayTeam}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(match.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {match.venue || 'TBD'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          match.status === 'live'
                            ? 'bg-red-500/20 text-red-400 animate-pulse'
                            : match.status === 'scheduled'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                      <motion.button
                        onClick={() => router.push(`/referee/matches/${match.id}`)}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 hover:bg-card rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-muted-foreground" />
                      </motion.button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="glass-card p-8 rounded-xl text-center">
                    <Calendar size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h4 className="font-semibold mb-2">No Upcoming Matches</h4>
                    <p className="text-muted-foreground mb-4">You don't have any matches assigned yet</p>
                    <motion.button
                      onClick={() => router.push('/referee/availability')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
                    >
                      Update Availability
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Recent Performance */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="text-yellow-500" size={20} />
                  Recent Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-500" size={20} />
                      <span className="font-medium">Excellent Match Control</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 days ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-blue-500" size={20} />
                      <span className="font-medium">Fair Play Award</span>
                    </div>
                    <span className="text-sm text-muted-foreground">1 week ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="text-yellow-500" size={20} />
                      <span className="font-medium">Minor Delay</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 weeks ago</span>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="text-blue-500" size={20} />
                  Availability Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">This Weekend</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Next Week</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Evening Matches</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold">
                      Limited
                    </span>
                  </div>
                  <div className="text-center pt-4">
                    <motion.button
                      onClick={() => router.push('/referee/availability')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
                    >
                      Update Availability
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
