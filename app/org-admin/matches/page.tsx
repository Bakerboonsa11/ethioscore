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
  MapPin,
  Eye,
  Crown,
  Sparkles,
  Star,
  Flame,
  Rocket,
  Thunderbolt,
  TrendingUp
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
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

export default function OrgAdminMatchesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { user, matches, setMatches } = useAppStore();

  useEffect(() => {
    // Simulate loading matches for the organization
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [setMatches]);

  // Mock stats for org-admin matches
  const stats = [
    {
      title: 'Total Matches',
      value: '156',
      icon: '⚽',
      trend: { value: 12, isPositive: true },
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50'
    },
    {
      title: 'Live Matches',
      value: '3',
      icon: '🔴',
      trend: { value: 1, isPositive: true },
      gradient: 'from-red-500 to-pink-500',
      glow: 'shadow-red-500/50'
    },
    {
      title: 'This Week',
      value: '23',
      icon: '📅',
      trend: { value: 5, isPositive: true },
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50'
    },
    {
      title: 'Completed',
      value: '133',
      icon: '✅',
      trend: { value: 8, isPositive: true },
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50'
    },
  ];

  // Mock matches data for org-admin
  const mockMatches = [
    {
      id: '1',
      homeTeam: 'Adama City FC',
      awayTeam: 'Hawassa City SC',
      homeScore: 2,
      awayScore: 1,
      status: 'completed',
      date: '2024-01-15',
      venue: 'Adama Stadium'
    },
    {
      id: '2',
      homeTeam: 'Diredawa United',
      awayTeam: 'Mekelle 70 Enderta',
      homeScore: 0,
      awayScore: 0,
      status: 'live',
      date: '2024-01-16',
      venue: 'Diredawa Stadium'
    },
    {
      id: '3',
      homeTeam: 'Bahir Dar Kenema',
      awayTeam: 'Welayta Dicha',
      homeScore: 0,
      awayScore: 0,
      status: 'scheduled',
      date: '2024-01-18',
      venue: 'Bahir Dar Stadium'
    },
    {
      id: '4',
      homeTeam: 'Shashemene City',
      awayTeam: 'Jimma Aba Jifar',
      homeScore: 1,
      awayScore: 3,
      status: 'completed',
      date: '2024-01-14',
      venue: 'Shashemene Stadium'
    },
    {
      id: '5',
      homeTeam: 'Gondar City',
      awayTeam: 'Dessie City',
      homeScore: 0,
      awayScore: 0,
      status: 'scheduled',
      date: '2024-01-19',
      venue: 'Gondar Stadium'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading matches...</p>
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
          headerTitle="Match Management"
          headerDescription="Monitor and manage all matches across your organization"
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/org-admin/matches/create')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Schedule Match
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={16} />
              </motion.div>
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* Ultra Organization Matches Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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

            {/* Ultra Live Matches */}
            {mockMatches.filter(m => m.status === 'live').length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <motion.h3
                    className="text-xl font-bold flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg animate-pulse">🔴</span>
                    </div>
                    <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                      Live Matches
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Flame className="w-6 h-6 text-red-400" />
                    </motion.div>
                  </motion.h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {mockMatches.filter(m => m.status === 'live').map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ x: 8, scale: 1.01 }}
                      className="glass-card p-6 rounded-3xl flex items-center justify-between hover:shadow-xl transition-all border border-white/10 backdrop-blur-xl group relative overflow-hidden"
                    >
                      {/* Live Pulse Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-red-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

                      {/* Animated Border */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-400/30 via-transparent to-red-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="font-bold text-lg text-white">
                            {match.homeTeam}
                          </span>
                          <motion.span
                            className="text-3xl font-bold text-white px-3 py-1 bg-red-500/20 rounded-xl border border-red-400/30"
                            whileHover={{ scale: 1.1 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {match.homeScore}
                          </motion.span>
                          <span className="text-white/60 font-bold text-xl">-</span>
                          <motion.span
                            className="text-3xl font-bold text-white px-3 py-1 bg-red-500/20 rounded-xl border border-red-400/30"
                            whileHover={{ scale: 1.1 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
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
                            <MapPin size={14} className="text-pink-400" />
                            <span>{match.venue}</span>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1"
                          >
                            <Calendar size={14} className="text-red-400 animate-pulse" />
                            <span className="text-red-400 font-semibold">LIVE</span>
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 relative z-10">
                        <motion.span
                          className="px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Rocket className="w-4 h-4 inline mr-1" />
                          LIVE
                        </motion.span>

                        <motion.button
                          onClick={() => router.push(`/org-admin/matches/${match.id}`)}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 group/button"
                        >
                          <Eye size={18} className="text-gray-300 group-hover/button:text-white transition-colors" />
                        </motion.button>
                      </div>

                      {/* Live Sparkle Effects */}
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                        className="absolute top-4 left-4 w-3 h-3 bg-red-400 rounded-full shadow-lg"
                      />

                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.2, 0.6, 0.2]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.8
                        }}
                        className="absolute bottom-4 right-4 w-2 h-2 bg-pink-400 rounded-full shadow-lg"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Ultra Recent Matches */}
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
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Recent Matches
                  </span>
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-5 h-5 text-green-400" />
                  </motion.div>
                </motion.h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {mockMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
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
                          })}</span>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-1"
                        >
                          <MapPin size={14} className="text-blue-400" />
                          <span>{match.venue}</span>
                        </motion.div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
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

                      <motion.button
                        onClick={() => router.push(`/org-admin/matches/${match.id}`)}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 group/button"
                      >
                        <Eye size={18} className="text-gray-300 group-hover/button:text-white transition-colors" />
                      </motion.button>
                    </div>

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
