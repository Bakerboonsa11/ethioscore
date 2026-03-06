'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Plus, Edit2, Users, Award, Calendar, Star, Mail, User, Crown, Sparkles, Flame, Rocket, Thunderbolt, TrendingUp, Eye } from 'lucide-react';
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
            {/* Ultra Referee Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {[
                {
                  title: 'Total Referees',
                  value: referees.length.toString(),
                  icon: '🛡️',
                  trend: { value: 2, isPositive: true },
                  gradient: 'from-blue-500 to-cyan-500',
                  glow: 'shadow-blue-500/50'
                },
                {
                  title: 'Elite Referees',
                  value: referees.length > 0 ? Math.ceil(referees.length * 0.3).toString() : '0',
                  icon: '👑',
                  trend: { value: 1, isPositive: true },
                  gradient: 'from-yellow-500 to-orange-500',
                  glow: 'shadow-yellow-500/50'
                },
                {
                  title: 'Total Matches',
                  value: (referees.length * 25).toString(),
                  icon: '⚽',
                  trend: { value: 5, isPositive: true },
                  gradient: 'from-green-500 to-emerald-500',
                  glow: 'shadow-green-500/50'
                },
                {
                  title: 'Avg Rating',
                  value: referees.length > 0 ? '4.5' : '0.0',
                  icon: '⭐',
                  trend: { value: 0.2, isPositive: true },
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

            {/* Ultra Referees Grid */}
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
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    League Referees
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
                {referees.length > 0 ? referees.map((referee, i) => (
                  <motion.div
                    key={referee._id || referee.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.3 + i * 0.05,
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
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Shield className="text-white" size={24} />
                        </div>
                        <motion.button
                          onClick={() => router.push(`/league-admin/referees/${referee._id || referee.id}/edit`)}
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
                        {referee.name || referee.username}
                      </motion.h4>

                      <div className="space-y-2 text-sm text-gray-400 mb-4">
                        <motion.p
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Mail size={14} className="text-pink-400" />
                          {referee.email}
                        </motion.p>
                        <motion.p
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          <User size={14} className="text-blue-400" />
                          @{referee.username}
                        </motion.p>
                        {referee.phone && (
                          <motion.p
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Shield size={14} className="text-green-400" />
                            {referee.phone}
                          </motion.p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <motion.div
                          className="flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Star className="text-yellow-500 fill-current" size={16} />
                          <span className="font-semibold text-yellow-400">4.5</span>
                        </motion.div>
                        <motion.span
                          className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-md bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          whileHover={{ scale: 1.05 }}
                        >
                          Active
                        </motion.span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <motion.span
                          className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 rounded text-xs border border-blue-400/30"
                          whileHover={{ scale: 1.05 }}
                        >
                          {userLeague?.name || 'League'}
                        </motion.span>
                      </div>
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
                      className="absolute top-4 left-4 w-3 h-3 bg-blue-400 rounded-full shadow-lg"
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
                      className="absolute bottom-4 right-4 w-2 h-2 bg-cyan-400 rounded-full shadow-lg"
                    />
                  </motion.div>
                )) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="col-span-full text-center py-12 glass-card rounded-3xl border border-white/10 backdrop-blur-xl"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield size={32} className="text-blue-400/60" />
                    </div>
                    <h4 className="font-semibold mb-2 text-white">No Referees Found</h4>
                    <p className="text-gray-400 mb-4">Start by adding your first referee</p>
                  </motion.div>
                )}

                {/* Add New Referee Card */}
                <motion.button
                  onClick={() => router.push('/league-admin/referees/add')}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + referees.length * 0.1 }}
                  className="glass-card p-6 rounded-3xl flex items-center justify-center min-h-48 hover:border-accent transition-colors border border-white/10 backdrop-blur-xl group relative overflow-hidden"
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
                    <p className="font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Add Referee</p>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Register a new referee</p>
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

            {/* Ultra Referee Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  label: '98.5%',
                  desc: 'Accuracy Rate',
                  icon: <Award size={24} className="text-green-400" />,
                  bg: 'from-green-500/20 to-emerald-500/20',
                  gradient: 'from-green-500 to-emerald-500'
                },
                {
                  label: '4.7/5',
                  desc: 'Average Rating',
                  icon: <Star size={24} className="text-yellow-400" />,
                  bg: 'from-yellow-500/20 to-orange-500/20',
                  gradient: 'from-yellow-500 to-orange-500'
                },
                {
                  label: '156',
                  desc: 'Matches This Season',
                  icon: <Calendar size={24} className="text-blue-400" />,
                  bg: 'from-blue-500/20 to-cyan-500/20',
                  gradient: 'from-blue-500 to-cyan-500'
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="text-center glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl group relative overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Ultra Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />

                  <div className="relative z-10">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {item.icon}
                    </motion.div>
                    <motion.h4
                      className="font-semibold mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.label}
                    </motion.h4>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{item.desc}</p>
                  </div>

                  {/* Performance Sparkle */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.8, 0.2]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: idx * 0.4
                    }}
                    className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full shadow-lg"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
