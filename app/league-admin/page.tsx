'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Users, Zap, Settings, Plus, Edit2, Calendar, Shield, Flag, Target, Award, Crown, Sparkles, Star, Flame, Rocket, TrendingUp, Eye, MapPin, Activity, Clock } from 'lucide-react';
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

// Ultra performance themes
const performanceThemes = {
  excellent: {
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/50',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    icon: '🚀'
  },
  good: {
    gradient: 'from-blue-500 via-cyan-500 to-sky-500',
    glow: 'shadow-blue-500/50',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    icon: '⚡'
  },
  average: {
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    glow: 'shadow-yellow-500/50',
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    icon: '⭐'
  },
  poor: {
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    glow: 'shadow-red-500/50',
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    icon: '💪'
  }
};

export default function LeagueAdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { user, leagues, setLeagues, matches, setMatches } = useAppStore();

  // Get the league that this admin manages
  const userLeague = leagues.find(league => {
    if (typeof user?.league === 'object' && user.league !== null) {
      return league._id === user.league._id;
    } else if (typeof user?.league === 'string') {
      return league._id === user.league || league.id === user.league;
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

  // Mock stats for the league
  const stats = [
    {
      title: 'Registered Teams',
      value: '16',
      icon: '⚽',
      trend: { value: 2, isPositive: true },
      color: 'green' as const,
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50'
    },
    {
      title: 'Total Matches',
      value: '48',
      icon: '📅',
      trend: { value: 4, isPositive: true },
      color: 'blue' as const,
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50'
    },
    {
      title: 'Active Referees',
      value: '8',
      icon: '👨‍⚖️',
      trend: { value: 1, isPositive: true },
      color: 'gold' as const,
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/50'
    },
    {
      title: 'Total Players',
      value: '320',
      icon: '👥',
      trend: { value: 12, isPositive: true },
      color: 'red' as const,
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50'
    },
  ];

  // Calculate league performance based on stats
  const totalTeams = parseInt(stats[0].value);
  const totalMatches = parseInt(stats[1].value);
  const performanceScore = totalTeams + totalMatches;

  const getPerformanceTheme = (score: number) => {
    if (score >= 60) return performanceThemes.excellent;
    if (score >= 40) return performanceThemes.good;
    if (score >= 20) return performanceThemes.average;
    return performanceThemes.poor;
  };

  const performanceTheme = getPerformanceTheme(performanceScore);

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
            {/* Ultra League Overview Hero */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative overflow-hidden"
            >
              {/* Dynamic Performance Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${performanceTheme.gradient} opacity-10 blur-3xl`}
              />

              <div className="relative glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  {/* Ultra League Logo */}
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-24 h-24 bg-gradient-to-br ${performanceTheme.gradient} rounded-3xl flex items-center justify-center text-4xl font-bold shadow-2xl ${performanceTheme.glow} border border-white/20 overflow-hidden`}>
                      🏆
                    </div>

                    {/* Performance Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className={`absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r ${performanceTheme.gradient} text-white text-xs font-bold rounded-full shadow-lg ${performanceTheme.glow}`}
                    >
                      {performanceTheme.icon} {performanceScore >= 60 ? 'Elite' : performanceScore >= 40 ? 'Strong' : performanceScore >= 20 ? 'Rising' : 'Building'}
                    </motion.div>

                    {/* Animated Sparkles */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"
                    >
                      <Sparkles size={12} className="text-yellow-900" />
                    </motion.div>
                  </motion.div>

                  {/* League Info */}
                  <div className="flex-1 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <motion.h2
                        className="text-4xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.02 }}
                      >
                        {displayLeague.name}
                      </motion.h2>
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Crown className="w-8 h-8 text-yellow-400" />
                      </motion.div>
                    </motion.div>

                    {/* Performance Metrics */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap items-center gap-6 text-gray-300"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`flex items-center gap-2 bg-gradient-to-r ${performanceTheme.gradient} px-4 py-2 rounded-xl shadow-lg ${performanceTheme.glow}`}
                      >
                        <Trophy size={18} className="text-white" />
                        <span className="font-bold text-white">{totalTeams} Teams</span>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                      >
                        <Calendar size={18} className="text-pink-400" />
                        <span className="font-medium">{displayLeague.year}</span>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                      >
                        <Target size={18} className="text-blue-400" />
                        <span className="font-medium">{displayLeague.type?.format || 'League'}</span>
                      </motion.div>

                      {displayLeague.region && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                        >
                          <Flag size={18} className="text-green-400" />
                          <span className="font-medium">{displayLeague.region}</span>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Status Badges */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-wrap gap-3"
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                          displayLeague.status === 'active'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/50'
                            : displayLeague.status === 'completed'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/50'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/50'
                        }`}
                      >
                        {displayLeague.status.charAt(0).toUpperCase() + displayLeague.status.slice(1)}
                      </motion.span>

                      {displayLeague.tier && (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r ${performanceTheme.gradient} text-white ${performanceTheme.glow}`}
                        >
                          <Shield className="w-4 h-4 inline mr-1" />
                          Tier {displayLeague.tier}
                        </motion.span>
                      )}

                      <motion.span
                        whileHover={{ scale: 1.05, rotate: 10 }}
                        className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 shadow-lg shadow-yellow-400/50"
                      >
                        <Star className="w-4 h-4 inline mr-1" />
                        Ultra Dashboard
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ultra Enhanced Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl relative overflow-hidden group ${stat.glow} hover:${stat.glow}`}
                >
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all`}>
                      <span className="text-2xl">{stat.icon}</span>
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
                      <TrendingUp size={12} className={stat.trend.isPositive ? "text-green-400" : "text-red-400"} />
                      <span className={`text-xs font-medium ${stat.trend.isPositive ? "text-green-400" : "text-red-400"}`}>
                        {stat.trend.isPositive ? '+' : ''}{stat.trend.value}
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
                      delay: i * 0.5
                    }}
                    className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Ultra Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  title: 'Manage Teams',
                  description: 'Add, edit, and organize teams',
                  icon: <Users size={24} className="text-blue-400" />,
                  gradient: 'from-blue-500 to-cyan-500',
                  glow: 'shadow-blue-500/50',
                  action: () => router.push('/league-admin/teams')
                },
                {
                  title: 'Schedule Matches',
                  description: 'Create and manage fixtures',
                  icon: <Zap size={24} className="text-green-400" />,
                  gradient: 'from-emerald-500 to-green-500',
                  glow: 'shadow-emerald-500/50',
                  action: () => router.push('/league-admin/matches')
                },
                {
                  title: 'Assign Referees',
                  description: 'Manage match officials',
                  icon: <Shield size={24} className="text-orange-400" />,
                  gradient: 'from-orange-500 to-red-500',
                  glow: 'shadow-orange-500/50',
                  action: () => router.push('/league-admin/referees')
                },
                {
                  title: 'League Settings',
                  description: 'Configure league preferences',
                  icon: <Settings size={24} className="text-purple-400" />,
                  gradient: 'from-purple-500 to-pink-500',
                  glow: 'shadow-purple-500/50',
                  action: () => router.push('/league-admin/settings')
                }
              ].map((action, i) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.action}
                  className={`glass-card p-6 rounded-3xl text-left hover:shadow-xl transition-all group border border-white/10 backdrop-blur-xl ${action.glow} hover:${action.glow}`}
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`} />

                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all`}>
                      {action.icon}
                    </div>

                    <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {action.title}
                    </h3>

                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                      {action.description}
                    </p>

                    {/* Hover Arrow */}
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      className="absolute top-6 right-6 text-gray-500 group-hover:text-white transition-colors"
                    >
                      →
                    </motion.div>
                  </div>

                  {/* Corner Sparkle */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.7
                    }}
                    className="absolute bottom-4 right-4 w-2 h-2 bg-yellow-400 rounded-full"
                  />
                </motion.button>
              ))}
            </motion.div>

            {/* Ultra Recent Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <motion.h3
                  className="text-xl font-bold flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Recent Matches
                  </span>
                </motion.h3>
                <motion.button
                  onClick={() => router.push('/league-admin/matches')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-accent hover:text-accent/80 font-semibold text-sm flex items-center gap-2"
                >
                  View All
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {leagueMatches.length > 0 ? leagueMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ x: 6, scale: 1.01 }}
                    className="glass-card p-6 rounded-3xl flex items-center justify-between hover:shadow-xl transition-all border border-white/10 backdrop-blur-xl group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="font-bold text-lg text-white">
                          {match.homeTeam}
                        </span>
                        <motion.span
                          className="text-3xl font-bold text-white px-3 py-1 bg-white/10 rounded-xl border border-white/20"
                          whileHover={{ scale: 1.1 }}
                        >
                          {match.homeScore}
                        </motion.span>
                        <span className="text-white/60 font-bold text-xl">-</span>
                        <motion.span
                          className="text-3xl font-bold text-white px-3 py-1 bg-white/10 rounded-xl border border-white/20"
                          whileHover={{ scale: 1.1 }}
                        >
                          {match.awayScore}
                        </motion.span>
                        <span className="font-bold text-lg text-white">
                          {match.awayTeam}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-1"
                        >
                          <Calendar size={14} className="text-pink-400" />
                          <span>{new Date(match.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-1"
                        >
                          <MapPin size={14} className="text-blue-400" />
                          <span>{match.venue || 'TBD'}</span>
                        </motion.div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <motion.span
                        className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                          match.status === 'live'
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/50 animate-pulse'
                            : match.status === 'completed'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/50'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </motion.span>

                      <motion.button
                        onClick={() => router.push(`/league-admin/matches/${match.id}`)}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 group/button"
                      >
                        <Eye size={18} className="text-gray-300 group-hover/button:text-white transition-colors" />
                      </motion.button>
                    </div>

                    {/* Match Result Indicator */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                        match.homeScore > match.awayScore
                          ? 'bg-green-400 shadow-green-400/50'
                          : match.homeScore === match.awayScore
                            ? 'bg-yellow-400 shadow-yellow-400/50'
                            : 'bg-red-400 shadow-red-400/50'
                      } shadow-lg`}
                    />
                  </motion.div>
                )) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8 rounded-3xl text-center border border-white/10 backdrop-blur-xl"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap size={32} className="text-purple-400/60" />
                    </div>
                    <h4 className="font-semibold mb-2 text-white">No Matches Yet</h4>
                    <p className="text-gray-400 mb-4">Your upcoming matches will appear here</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Ultra League Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Season Performance */}
              <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                <motion.h3
                  className="text-lg font-bold mb-6 flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${performanceTheme.gradient} rounded-xl flex items-center justify-center shadow-lg ${performanceTheme.glow}`}>
                    <Activity size={18} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Season Performance
                  </span>
                </motion.h3>

                <div className="space-y-4">
                  {[
                    { label: 'Matches Played', value: totalMatches, color: 'text-blue-400' },
                    { label: 'Teams Registered', value: totalTeams, color: 'text-green-400' },
                    { label: 'Active Referees', value: 8, color: 'text-yellow-400' },
                    { label: 'Total Players', value: 320, color: 'text-red-400' }
                  ].map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <span className="text-gray-300">{item.label}</span>
                      <motion.span
                        className={`font-bold ${item.color}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {item.value}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* League Progress */}
              <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                <motion.h3
                  className="text-lg font-bold mb-6 flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Target size={18} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    League Progress
                  </span>
                </motion.h3>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: 'Round 3 of 8', desc: 'Current match week', icon: <Award size={24} className="text-green-400" />, bg: 'from-green-500/20 to-emerald-500/20' },
                    { label: '24 Matches', desc: 'Completed this season', icon: <Calendar size={24} className="text-blue-400" />, bg: 'from-blue-500/20 to-cyan-500/20' },
                    { label: '6 Weeks', desc: 'Remaining in season', icon: <Clock size={24} className="text-orange-400" />, bg: 'from-orange-500/20 to-red-500/20' }
                  ].map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className={`flex items-center gap-4 p-4 bg-gradient-to-r ${item.bg} rounded-xl border border-white/10`}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.bg} rounded-xl flex items-center justify-center shadow-lg`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">{item.label}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
