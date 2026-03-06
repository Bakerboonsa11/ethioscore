'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Users,
  Eye,
  TrendingUp,
  Target,
  Zap,
  Sparkles,
  Crown,
  Star,
  Flame,
  Thunderbolt,
  Heart,
  Award,
  Activity
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/club-admin', icon: <Users size={20} /> },
  { label: 'Team Profile', href: '/club-admin/profile', icon: <Users size={20} /> },
  { label: 'Players', href: '/club-admin/players', icon: <Users size={20} /> },
  { label: 'Matches', href: '/club-admin/matches', icon: <Zap size={20} /> },
  { label: 'Statistics', href: '/club-admin/stats', icon: <Users size={20} /> },
  { label: 'Settings', href: '/club-admin/settings', icon: <Users size={20} /> },
];

// Ultra result themes
const resultThemes = {
  win: {
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/50',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    icon: '🏆',
    border: 'border-emerald-400/30'
  },
  draw: {
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    glow: 'shadow-yellow-500/50',
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    icon: '🤝',
    border: 'border-yellow-400/30'
  },
  loss: {
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    glow: 'shadow-red-500/50',
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    icon: '💪',
    border: 'border-red-400/30'
  },
  upcoming: {
    gradient: 'from-blue-500 via-cyan-500 to-sky-500',
    glow: 'shadow-blue-500/50',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    icon: '⚽',
    border: 'border-blue-400/30'
  },
  live: {
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
    glow: 'shadow-purple-500/50',
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    icon: '🔴',
    border: 'border-purple-400/30'
  }
};

// Mock match data
const mockMatches = [
  {
    id: '1',
    homeTeam: 'Dedebit FC',
    awayTeam: 'Awash International',
    homeScore: 2,
    awayScore: 1,
    date: '2024-01-20T15:00:00Z',
    venue: 'Addis Ababa Stadium',
    status: 'completed',
    league: 'Ethiopian Premier League',
    round: 'Round 15',
  },
  {
    id: '2',
    homeTeam: 'Dedebit FC',
    awayTeam: 'Ethiopian Coffee',
    homeScore: null,
    awayScore: null,
    date: '2024-01-27T16:00:00Z',
    venue: 'Addis Ababa Stadium',
    status: 'scheduled',
    league: 'Ethiopian Premier League',
    round: 'Round 16',
  },
  {
    id: '3',
    homeTeam: 'Adama City',
    awayTeam: 'Dedebit FC',
    homeScore: 1,
    awayScore: 1,
    date: '2024-01-10T14:30:00Z',
    venue: 'Adama Stadium',
    status: 'completed',
    league: 'Ethiopian Premier League',
    round: 'Round 14',
  },
  {
    id: '4',
    homeTeam: 'Dedebit FC',
    awayTeam: 'Dire Dawa City',
    homeScore: 0,
    awayScore: 0,
    date: '2024-01-03T15:00:00Z',
    venue: 'Addis Ababa Stadium',
    status: 'completed',
    league: 'Ethiopian Premier League',
    round: 'Round 13',
  },
];

export default function ClubAdminMatchesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const { user, teams, matches } = useAppStore();

  // Get the team that this club admin manages
  const userTeam = teams.find(team => {
    const clubAdminId = typeof team.clubAdmin === 'object' ? team.clubAdmin?._id : team.clubAdmin;
    return clubAdminId === user?._id;
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get team's matches
  const teamMatches = mockMatches.filter(match =>
    match.homeTeam === userTeam?.name || match.awayTeam === userTeam?.name
  );

  // Filter matches based on selected filter
  const filteredMatches = teamMatches.filter(match => {
    if (filter === 'upcoming') return match.status === 'scheduled';
    if (filter === 'completed') return match.status === 'completed';
    return true;
  });

  // Sort matches by date (most recent first)
  const sortedMatches = filteredMatches.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate match statistics
  const totalMatches = teamMatches.length;
  const completedMatches = teamMatches.filter(m => m.status === 'completed').length;
  const upcomingMatches = teamMatches.filter(m => m.status === 'scheduled').length;
  const homeWins = teamMatches.filter(m =>
    m.status === 'completed' &&
    m.homeTeam === userTeam?.name &&
    m.homeScore !== null && m.awayScore !== null && m.homeScore > m.awayScore
  ).length;
  const awayWins = teamMatches.filter(m =>
    m.status === 'completed' &&
    m.awayTeam === userTeam?.name &&
    m.awayScore !== null && m.homeScore !== null && m.awayScore > m.homeScore
  ).length;
  const draws = teamMatches.filter(m =>
    m.status === 'completed' && m.homeScore !== null && m.awayScore !== null && m.homeScore === m.awayScore
  ).length;

  const totalWins = homeWins + awayWins;
  const winRate = completedMatches > 0 ? Math.round((totalWins / completedMatches) * 100) : 0;

  // Get result for a match
  const getMatchResult = (match: any) => {
    if (match.status !== 'completed') return match.status === 'live' ? 'live' : 'upcoming';

    const isHomeTeam = match.homeTeam === userTeam?.name;
    const userScore = isHomeTeam ? match.homeScore : match.awayScore;
    const opponentScore = isHomeTeam ? match.awayScore : match.homeScore;

    if (userScore > opponentScore) return 'win';
    if (userScore < opponentScore) return 'loss';
    return 'draw';
  };

  // Get theme for match result
  const getMatchTheme = (match: any) => {
    const result = getMatchResult(match);
    return resultThemes[result as keyof typeof resultThemes];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-pink-500 border-purple-500/30 rounded-full mx-auto mb-6"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
          >
            Loading Ultra Matches...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!userTeam) {
    return (
      <ProtectedRoute requiredRole="club-admin">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center glass-card p-8 rounded-3xl max-w-md mx-4 border border-white/10"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Team Not Assigned
            </h2>
            <p className="text-gray-300 mb-6">
              You haven't been assigned to manage a team yet. Please contact your league administrator.
            </p>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="club-admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <GradientBackground />

        <DashboardLayout
          title="Club Admin"
          headerTitle="Ultra Match Center"
          headerDescription={`Experience ${userTeam.name}'s matches with ultra stylish design and real-time updates`}
          navItems={navItems}
        >
          <div className="space-y-8">
            {/* Ultra Match Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  title: 'Total Matches',
                  value: totalMatches.toString(),
                  icon: <Zap size={24} className="text-white" />,
                  gradient: 'from-blue-500 to-cyan-500',
                  glow: 'shadow-blue-500/50',
                  change: '+1',
                  changeType: 'positive' as const
                },
                {
                  title: 'Victories',
                  value: totalWins.toString(),
                  icon: <Trophy size={24} className="text-white" />,
                  gradient: 'from-emerald-500 to-green-500',
                  glow: 'shadow-emerald-500/50',
                  change: `${homeWins}H ${awayWins}A`,
                  changeType: 'positive' as const
                },
                {
                  title: 'Draws',
                  value: draws.toString(),
                  icon: <Target size={24} className="text-white" />,
                  gradient: 'from-yellow-500 to-amber-500',
                  glow: 'shadow-yellow-500/50',
                  change: 'Clean Sheets',
                  changeType: 'neutral' as const
                },
                {
                  title: 'Win Rate',
                  value: `${winRate}%`,
                  icon: <Crown size={24} className="text-white" />,
                  gradient: 'from-purple-500 to-pink-500',
                  glow: 'shadow-purple-500/50',
                  change: winRate >= 70 ? 'Elite' : winRate >= 50 ? 'Strong' : 'Rising',
                  changeType: winRate >= 50 ? 'positive' : 'neutral' as const
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl relative overflow-hidden group ${stat.glow} hover:${stat.glow}`}
                >
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all`}>
                      {stat.icon}
                    </div>

                    <motion.h3
                      className="text-3xl font-bold mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.05 }}
                    >
                      {stat.value}
                    </motion.h3>

                    <p className="text-gray-400 text-sm mb-2">{stat.title}</p>

                    <motion.div
                      className="flex items-center gap-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className={`text-xs font-medium ${
                        stat.changeType === 'positive' ? 'text-green-400' :
                        stat.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {stat.change}
                      </span>
                    </motion.div>
                  </div>

                  {/* Animated Sparkles */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                    className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Ultra Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
            >
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'all', label: 'All Matches', count: totalMatches, icon: '📊', gradient: 'from-purple-500 to-pink-500' },
                  { key: 'upcoming', label: 'Upcoming', count: upcomingMatches, icon: '⏰', gradient: 'from-blue-500 to-cyan-500' },
                  { key: 'completed', label: 'Completed', count: completedMatches, icon: '✅', gradient: 'from-emerald-500 to-green-500' },
                ].map((tab, index) => (
                  <motion.button
                    key={tab.key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(tab.key as any)}
                    className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                      filter === tab.key
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl shadow-white/20`
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                    <motion.span
                      className={`px-3 py-1 rounded-full text-sm ${
                        filter === tab.key
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-gray-300'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {tab.count}
                    </motion.span>

                    {/* Active indicator */}
                    {filter === tab.key && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Ultra Matches List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <motion.h3
                className="text-xl font-bold flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity size={20} className="text-white" />
                </div>
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Match Results & Fixtures
                </span>
              </motion.h3>

              {sortedMatches.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <Zap size={64} className="text-pink-400/60" />
                    </div>
                    {/* Animated sparkles around empty state */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                        className="absolute w-2 h-2 bg-pink-400 rounded-full"
                        style={{
                          top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                          left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                        }}
                      />
                    ))}
                  </div>

                  <motion.h3
                    className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    {filter === 'upcoming' ? 'No Upcoming Fixtures' : filter === 'completed' ? 'No Match History' : 'No Matches Found'}
                  </motion.h3>

                  <p className="text-gray-400 mb-8 text-lg">
                    {filter === 'upcoming' ? 'Your next matches will appear here' : 'Match results will be displayed here'}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {sortedMatches.map((match, i) => {
                    const theme = getMatchTheme(match);
                    const result = getMatchResult(match);
                    const isHomeTeam = match.homeTeam === userTeam?.name;

                    return (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, x: -30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                          delay: 0.1 + i * 0.1,
                          duration: 0.8,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        whileHover={{ scale: 1.02, x: 10 }}
                        className={`glass-card p-8 rounded-3xl border backdrop-blur-xl relative overflow-hidden group ${theme.border} ${theme.glow} hover:${theme.glow}`}
                      >
                        {/* Dynamic Background */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                        />

                        <div className="relative z-10">
                          {/* Match Header */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <motion.div
                                className={`px-4 py-2 bg-gradient-to-r ${theme.gradient} rounded-xl shadow-lg`}
                                whileHover={{ scale: 1.05 }}
                              >
                                <span className="text-white font-bold text-sm">
                                  {match.league} • {match.round}
                                </span>
                              </motion.div>

                              <motion.span
                                className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                                  result === 'live'
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/50 animate-pulse'
                                    : result === 'upcoming'
                                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/50'
                                      : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                              >
                                {result === 'live' && <span className="mr-2">{theme.icon}</span>}
                                {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                              </motion.span>
                            </div>

                            {/* Result Badge */}
                            {result !== 'upcoming' && result !== 'live' && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white font-bold rounded-2xl shadow-2xl ${theme.glow}`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{theme.icon}</span>
                                  <span>
                                    {result === 'win' ? 'VICTORY' :
                                     result === 'draw' ? 'DRAW' : 'DEFEAT'}
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {/* Teams and Score */}
                          <div className="flex items-center justify-center gap-12 mb-8">
                            {/* Home Team */}
                            <motion.div
                              className={`flex-1 text-center p-6 rounded-3xl border-2 transition-all ${
                                isHomeTeam ? `border-white/30 bg-white/5 ${result === 'win' ? 'shadow-2xl shadow-green-500/30' : ''}` : 'border-white/10'
                              }`}
                              whileHover={{ scale: 1.02 }}
                            >
                              <motion.h3
                                className={`text-2xl font-bold mb-4 ${
                                  isHomeTeam ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'text-gray-300'
                                }`}
                                whileHover={{ scale: 1.05 }}
                              >
                                {match.homeTeam}
                              </motion.h3>

                              {match.status === 'completed' ? (
                                <motion.div
                                  className={`text-6xl font-bold mb-2 ${
                                    isHomeTeam
                                      ? result === 'win'
                                        ? 'bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent'
                                        : result === 'loss'
                                          ? 'bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent'
                                          : 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'
                                      : 'text-gray-400'
                                  }`}
                                  initial={{ scale: 0.5 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {match.homeScore}
                                </motion.div>
                              ) : (
                                <motion.div
                                  className="text-6xl font-bold text-gray-500 mb-2"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  ?
                                </motion.div>
                              )}

                              {isHomeTeam && (
                                <motion.div
                                  className="flex items-center justify-center gap-2 mt-4"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
                                  <span className="text-sm text-gray-300 font-medium">YOUR TEAM</span>
                                </motion.div>
                              )}
                            </motion.div>

                            {/* VS Section */}
                            <motion.div
                              className="flex flex-col items-center justify-center px-8"
                              whileHover={{ scale: 1.1, rotate: 10 }}
                            >
                              <motion.div
                                className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                VS
                              </motion.div>

                              {match.status === 'completed' && (
                                <motion.div
                                  className={`px-4 py-2 bg-gradient-to-r ${theme.gradient} text-white font-bold rounded-xl shadow-lg ${theme.glow}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.8 + i * 0.1 }}
                                >
                                  {result === 'win' ? '🏆 WIN' :
                                   result === 'draw' ? '🤝 DRAW' : '💪 LOSS'}
                                </motion.div>
                              )}
                            </motion.div>

                            {/* Away Team */}
                            <motion.div
                              className={`flex-1 text-center p-6 rounded-3xl border-2 transition-all ${
                                !isHomeTeam ? `border-white/30 bg-white/5 ${result === 'win' ? 'shadow-2xl shadow-green-500/30' : ''}` : 'border-white/10'
                              }`}
                              whileHover={{ scale: 1.02 }}
                            >
                              <motion.h3
                                className={`text-2xl font-bold mb-4 ${
                                  !isHomeTeam ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'text-gray-300'
                                }`}
                                whileHover={{ scale: 1.05 }}
                              >
                                {match.awayTeam}
                              </motion.h3>

                              {match.status === 'completed' ? (
                                <motion.div
                                  className={`text-6xl font-bold mb-2 ${
                                    !isHomeTeam
                                      ? result === 'win'
                                        ? 'bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent'
                                        : result === 'loss'
                                          ? 'bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent'
                                          : 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'
                                      : 'text-gray-400'
                                  }`}
                                  initial={{ scale: 0.5 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {match.awayScore}
                                </motion.div>
                              ) : (
                                <motion.div
                                  className="text-6xl font-bold text-gray-500 mb-2"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  ?
                                </motion.div>
                              )}

                              {!isHomeTeam && (
                                <motion.div
                                  className="flex items-center justify-center gap-2 mt-4"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
                                  <span className="text-sm text-gray-300 font-medium">YOUR TEAM</span>
                                </motion.div>
                              )}
                            </motion.div>
                          </div>

                          {/* Match Details */}
                          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                            <motion.div
                              className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Calendar size={16} className="text-pink-400" />
                              <span className="font-medium">
                                {new Date(match.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </motion.div>

                            <motion.div
                              className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Clock size={16} className="text-blue-400" />
                              <span className="font-medium">
                                {new Date(match.date).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </motion.div>

                            <motion.div
                              className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                              whileHover={{ scale: 1.05 }}
                            >
                              <MapPin size={16} className="text-green-400" />
                              <span className="font-medium">{match.venue}</span>
                            </motion.div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-center mt-6">
                            <motion.button
                              onClick={() => router.push(`/club-admin/matches/${match.id}`)}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-white rounded-2xl font-semibold border border-white/20 group"
                            >
                              <Eye size={20} className="group-hover:text-blue-300 transition-colors" />
                              <span>View Ultra Details</span>
                              <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                →
                              </motion.span>
                            </motion.button>
                          </div>
                        </div>

                        {/* Animated Corner Sparkle */}
                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.9, 0.3],
                            rotate: [0, 180, 360]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 0.4
                          }}
                          className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${theme.gradient.split(' ')[0].replace('from-', '')}-400 rounded-full shadow-lg`}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
