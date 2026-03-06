'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Users, Zap, Settings, Plus, Edit2, Calendar, Crown, Sparkles, Star, Flame, Rocket, Bolt, TrendingUp, Eye, MapPin } from 'lucide-react';
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
            {/* Ultra Organization Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  title: 'Active Leagues',
                  value: mockLeagues.filter((l) => l.status === 'active').length.toString(),
                  icon: '🏆',
                  trend: { value: 3, isPositive: true },
                  gradient: 'from-yellow-500 to-orange-500',
                  glow: 'shadow-yellow-500/50'
                },
                {
                  title: 'Total Clubs',
                  value: '48',
                  icon: '⚽',
                  trend: { value: 8, isPositive: true },
                  gradient: 'from-green-500 to-emerald-500',
                  glow: 'shadow-green-500/50'
                },
                {
                  title: 'Matches This Week',
                  value: '12',
                  icon: '📅',
                  trend: { value: 2, isPositive: false },
                  gradient: 'from-blue-500 to-cyan-500',
                  glow: 'shadow-blue-500/50'
                },
                {
                  title: 'Registered Players',
                  value: '1,240',
                  icon: '👥',
                  trend: { value: 45, isPositive: true },
                  gradient: 'from-purple-500 to-pink-500',
                  glow: 'shadow-purple-500/50'
                },
              ].map((stat, i) => (
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

            {/* Ultra Leagues Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <motion.h3
                  className="text-xl font-bold flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Active Leagues
                  </span>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                </motion.h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leagues.map((league, i) => (
                  <motion.div
                    key={league.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.5 + i * 0.05,
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{
                      y: -8,
                      scale: 1.03,
                      rotateY: 3,
                      transition: { duration: 0.3 }
                    }}
                    className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 glass-card p-6 border border-white/10 backdrop-blur-xl"
                  >
                    {/* Ultra Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Trophy className="text-white" size={24} />
                        </div>
                        <motion.button
                          onClick={() => router.push('/org-admin/leagues')}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all"
                        >
                          <Edit2 size={18} className="text-gray-300 group-hover:text-white transition-colors" />
                        </motion.button>
                      </div>

                      <motion.h4
                        className="text-lg font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.02 }}
                      >
                        {league.name}
                      </motion.h4>

                      <div className="space-y-2 text-sm text-gray-400 mb-4">
                        <motion.p
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Calendar size={14} className="text-pink-400" />
                          Year: {league.year}
                        </motion.p>
                        <motion.p
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Settings size={14} className="text-blue-400" />
                          Format: {league.type?.format || 'N/A'}
                        </motion.p>
                        {league.region && (
                          <motion.p
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                          >
                            <MapPin size={14} className="text-green-400" />
                            Region: {league.region}
                          </motion.p>
                        )}
                      </div>

                      <motion.span
                        className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${
                          league.status === 'active'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                            : league.status === 'completed'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {league.status.charAt(0).toUpperCase() + league.status.slice(1)}
                      </motion.span>
                    </div>

                    {/* Ultra Sparkle Effects */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                      className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
                    />

                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.6, 0.2]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.7
                      }}
                      className="absolute bottom-4 right-4 w-2 h-2 bg-orange-400 rounded-full shadow-lg"
                    />
                  </motion.div>
                ))}

                {/* Create New League Card */}
                <motion.button
                  onClick={() => router.push('/org-admin/leagues/create')}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + leagues.length * 0.1 }}
                  className="glass-card p-6 rounded-3xl flex items-center justify-center min-h-40 hover:border-accent transition-colors border border-white/10 backdrop-blur-xl group relative overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="text-center relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl"
                    >
                      <Plus size={24} className="text-white" />
                    </motion.div>
                    <p className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Create New League</p>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Start a new competition</p>
                  </div>

                  {/* Add Button Sparkle */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.7, 0.2]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: 0.5
                    }}
                    className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full shadow-lg"
                  />
                </motion.button>
              </div>
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
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Recent Matches
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-5 h-5 text-green-400" />
                  </motion.div>
                </motion.h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {matches.slice(0, 5).map((match, index) => (
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

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={16} className="text-pink-400" />
                        <span>{new Date(match.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}</span>
                      </div>
                    </div>

                    <motion.span
                      className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                        match.status === 'live'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                          : match.status === 'completed'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </motion.span>

                    {/* Match Sparkle Effects */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.4
                      }}
                      className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full shadow-lg"
                    />

                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.6, 0.2]
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        delay: index * 0.9
                      }}
                      className="absolute bottom-4 left-4 w-2 h-2 bg-green-400 rounded-full shadow-lg"
                    />
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
