'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Trophy,
  Users,
  Zap,
  Settings,
  Plus,
  Edit2,
  Calendar,
  Shield,
  Flag,
  Target,
  Award,
  TrendingUp,
  Activity,
  Clock,
  MapPin,
  UserPlus,
  Eye,
  Star,
  Sparkles,
  Crown,
  Heart,
  Flame,
  Rocket,
  Thunderbolt
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/club-admin', icon: <BarChart3 size={20} /> },
  { label: 'Team Profile', href: '/club-admin/profile', icon: <Users size={20} /> },
  { label: 'Players', href: '/club-admin/players', icon: <UserPlus size={20} /> },
  { label: 'Matches', href: '/club-admin/matches', icon: <Zap size={20} /> },
  { label: 'Statistics', href: '/club-admin/stats', icon: <TrendingUp size={20} /> },
  { label: 'Settings', href: '/club-admin/settings', icon: <Settings size={20} /> },
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

export default function ClubAdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { user, teams, matches, fetchTeams, fetchMatches } = useAppStore();

  // Get the team that this club admin manages
  const userTeam = teams.find(team => {
    const clubAdminId = typeof team.clubAdmin === 'object' ? team.clubAdmin?._id : team.clubAdmin;
    return clubAdminId === user?._id;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTeams();
        await fetchMatches();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchTeams, fetchMatches]);

  // Get team's matches
  const teamMatches = matches.filter(match =>
    match.homeTeam === userTeam?.name || match.awayTeam === userTeam?.name
  );

  // Calculate team statistics
  const totalMatches = teamMatches.length;
  const wonMatches = teamMatches.filter(match =>
    (match.homeTeam === userTeam?.name && match.homeScore > match.awayScore) ||
    (match.awayTeam === userTeam?.name && match.awayScore > match.homeScore)
  ).length;
  const drawnMatches = teamMatches.filter(match => match.homeScore === match.awayScore).length;
  const lostMatches = totalMatches - wonMatches - drawnMatches;

  const winRate = totalMatches > 0 ? Math.round((wonMatches / totalMatches) * 100) : 0;

  // Get performance theme based on win rate
  const getPerformanceTheme = (winRate: number) => {
    if (winRate >= 70) return performanceThemes.excellent;
    if (winRate >= 50) return performanceThemes.good;
    if (winRate >= 30) return performanceThemes.average;
    return performanceThemes.poor;
  };

  const performanceTheme = getPerformanceTheme(winRate);

  // Enhanced stats with themes
  const stats = [
    {
      title: 'Total Matches',
      value: totalMatches.toString(),
      icon: '⚽',
      trend: { value: 2, isPositive: true },
      color: 'blue' as const,
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50'
    },
    {
      title: 'Wins',
      value: wonMatches.toString(),
      icon: '🏆',
      trend: { value: 1, isPositive: true },
      color: 'green' as const,
      gradient: 'from-emerald-500 to-green-500',
      glow: 'shadow-emerald-500/50'
    },
    {
      title: 'Win Rate',
      value: `${winRate}%`,
      icon: performanceTheme.icon,
      trend: { value: 5, isPositive: winRate > 50 },
      color: 'gold' as const,
      gradient: performanceTheme.gradient,
      glow: performanceTheme.glow
    },
    {
      title: 'Active Players',
      value: userTeam?.playersCount?.toString() || '22',
      icon: '👥',
      trend: { value: 0, isPositive: true },
      color: 'red' as const,
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50'
    },
  ];

  // Recent matches for this team
  const recentMatches = teamMatches.slice(0, 5);

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
            Loading Ultra Dashboard...
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
              <Shield className="w-10 h-10 text-white" />
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
          headerTitle={`${userTeam.name} Ultra Dashboard`}
          headerDescription="Your team's performance at a glance with ultra stylish design"
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/club-admin/players/add')}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              <Sparkles size={20} />
              Add Player
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* Ultra Team Overview Hero */}
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
                  {/* Ultra Team Logo */}
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-24 h-24 bg-gradient-to-br ${performanceTheme.gradient} rounded-3xl flex items-center justify-center text-4xl font-bold shadow-2xl ${performanceTheme.glow} border border-white/20 overflow-hidden`}>
                      {userTeam.logo ? (
                        <motion.img
                          src={userTeam.logo}
                          alt={userTeam.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <motion.span
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {userTeam.name.charAt(0)}
                        </motion.span>
                      )}
                    </div>

                    {/* Performance Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className={`absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r ${performanceTheme.gradient} text-white text-xs font-bold rounded-full shadow-lg ${performanceTheme.glow}`}
                    >
                      {performanceTheme.icon} {winRate >= 70 ? 'Elite' : winRate >= 50 ? 'Strong' : winRate >= 30 ? 'Rising' : 'Building'}
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

                  {/* Team Info */}
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
                        {userTeam.name}
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
                        <span className="font-bold text-white">{winRate}% Win Rate</span>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                      >
                        <Calendar size={18} className="text-pink-400" />
                        <span className="font-medium">Founded {userTeam.founded}</span>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                      >
                        <MapPin size={18} className="text-blue-400" />
                        <span className="font-medium">{userTeam.location}</span>
                      </motion.div>

                      {userTeam.stadium && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                        >
                          <Flag size={18} className="text-green-400" />
                          <span className="font-medium">{userTeam.stadium}</span>
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
                          userTeam.status === 'active'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/50'
                            : userTeam.status === 'inactive'
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/50'
                              : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/50'
                        }`}
                      >
                        {userTeam.status.charAt(0).toUpperCase() + userTeam.status.slice(1)}
                      </motion.span>

                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r ${performanceTheme.gradient} text-white ${performanceTheme.glow}`}
                      >
                        <Shield className="w-4 h-4 inline mr-1" />
                        Performance: {winRate >= 70 ? 'Elite' : winRate >= 50 ? 'Strong' : winRate >= 30 ? 'Rising' : 'Building'}
                      </motion.span>

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
                  title: 'Team Profile',
                  description: 'Update team information',
                  icon: <Users size={24} className="text-blue-400" />,
                  gradient: 'from-blue-500 to-cyan-500',
                  glow: 'shadow-blue-500/50',
                  action: () => router.push('/club-admin/profile')
                },
                {
                  title: 'Manage Players',
                  description: 'Add and manage squad',
                  icon: <UserPlus size={24} className="text-green-400" />,
                  gradient: 'from-emerald-500 to-green-500',
                  glow: 'shadow-emerald-500/50',
                  action: () => router.push('/club-admin/players')
                },
                {
                  title: 'View Matches',
                  description: 'Upcoming and results',
                  icon: <Zap size={24} className="text-orange-400" />,
                  gradient: 'from-orange-500 to-red-500',
                  glow: 'shadow-orange-500/50',
                  action: () => router.push('/club-admin/matches')
                },
                {
                  title: 'Performance',
                  description: 'View detailed statistics',
                  icon: <TrendingUp size={24} className="text-purple-400" />,
                  gradient: 'from-purple-500 to-pink-500',
                  glow: 'shadow-purple-500/50',
                  action: () => router.push('/club-admin/stats')
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
                  onClick={() => router.push('/club-admin/matches')}
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
                {recentMatches.length > 0 ? recentMatches.map((match, index) => (
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
                        <span className={`font-bold text-lg ${match.homeTeam === userTeam.name ? 'text-accent' : 'text-white'}`}>
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
                        <span className={`font-bold text-lg ${match.awayTeam === userTeam.name ? 'text-accent' : 'text-white'}`}>
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
                        onClick={() => router.push(`/club-admin/matches/${match.id}`)}
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
                        (match.homeTeam === userTeam.name && match.homeScore > match.awayScore) ||
                        (match.awayTeam === userTeam.name && match.awayScore > match.homeScore)
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

            {/* Ultra Team Performance Overview */}
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
                    { label: 'Wins', value: wonMatches, color: 'text-green-400' },
                    { label: 'Draws', value: drawnMatches, color: 'text-yellow-400' },
                    { label: 'Losses', value: lostMatches, color: 'text-red-400' }
                  ].map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10"
                      whileHover={{ scale: 1.02, x: 2 }}
                    >
                      <span className="text-gray-300">{item.label}</span>
                      <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 }}
                    className="flex justify-between items-center pt-4 border-t border-white/10 p-3 bg-gradient-to-r from-white/5 to-white/10 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="font-medium text-white">Win Rate</span>
                    <motion.span
                      className={`font-bold text-2xl bg-gradient-to-r ${performanceTheme.gradient} bg-clip-text text-transparent`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {winRate}%
                    </motion.span>
                  </motion.div>
                </div>
              </div>

              {/* Team Goals */}
              <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                <motion.h3
                  className="text-lg font-bold mb-6 flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/50">
                    <Target size={18} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Team Goals
                  </span>
                </motion.h3>

                <div className="space-y-4">
                  {[
                    {
                      goal: 'Improve Win Rate',
                      current: winRate,
                      target: 65,
                      color: 'from-green-500 to-emerald-500',
                      icon: '📈'
                    },
                    {
                      goal: 'Player Development',
                      current: 75,
                      target: 100,
                      color: 'from-blue-500 to-cyan-500',
                      icon: '👥'
                    },
                    {
                      goal: 'Fan Engagement',
                      current: 50,
                      target: 100,
                      color: 'from-purple-500 to-pink-500',
                      icon: '💖'
                    }
                  ].map((goal, idx) => (
                    <motion.div
                      key={goal.goal}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{goal.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-300">{goal.goal}</p>
                          <p className="text-xs text-gray-500">
                            {goal.current < goal.target ? `Target: ${goal.target}%` : 'Goal achieved! 🎉'}
                          </p>
                        </div>
                        <div className={`w-16 h-2 bg-white/10 rounded-full overflow-hidden shadow-lg`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                            transition={{ delay: 1.2 + idx * 0.1, duration: 1 }}
                            className={`h-full bg-gradient-to-r ${goal.color} rounded-full shadow-sm`}
                          />
                        </div>
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
