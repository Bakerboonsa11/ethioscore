'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Edit2,
  Eye,
  Search,
  Filter,
  UserPlus,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Trophy,
  Star,
  Sparkles,
  Zap,
  Crown,
  Shield,
  Target,
  Award,
  TrendingUp,
  Activity,
  Heart
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/club-admin', icon: <Users size={20} /> },
  { label: 'Team Profile', href: '/club-admin/profile', icon: <Users size={20} /> },
  { label: 'Players', href: '/club-admin/players', icon: <UserPlus size={20} /> },
  { label: 'Matches', href: '/club-admin/matches', icon: <Users size={20} /> },
  { label: 'Statistics', href: '/club-admin/stats', icon: <Users size={20} /> },
  { label: 'Settings', href: '/club-admin/settings', icon: <Users size={20} /> },
];

// Ultra colorful position themes
const positionThemes = {
  Goalkeeper: {
    primary: '#f59e0b',
    secondary: '#fbbf24',
    accent: '#f97316',
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    glow: 'shadow-yellow-500/50',
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    icon: '⚽'
  },
  Defender: {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#06b6d4',
    gradient: 'from-blue-500 via-blue-400 to-cyan-500',
    glow: 'shadow-blue-500/50',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    icon: '🛡️'
  },
  Midfielder: {
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#22c55e',
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/50',
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    icon: '⚡'
  },
  Forward: {
    primary: '#ef4444',
    secondary: '#f87171',
    accent: '#dc2626',
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    glow: 'shadow-red-500/50',
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    icon: '🔥'
  }
};

export default function ClubAdminPlayersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const { user, teams, players, fetchPlayers } = useAppStore();

  // Get the team that this club admin manages
  const userTeam = teams.find(team => {
    const clubAdminId = typeof team.clubAdmin === 'object' ? team.clubAdmin?._id : team.clubAdmin;
    return clubAdminId === user?._id;
  });

  useEffect(() => {
    const loadData = async () => {
      if (userTeam) {
        try {
          await fetchPlayers(userTeam._id);
        } catch (error) {
          console.error('Error loading players:', error);
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, [fetchPlayers, userTeam]);

  // Filter players based on search and filters
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
    const matchesStatus = statusFilter === 'all' || player.status === statusFilter;

    return matchesSearch && matchesPosition && matchesStatus;
  });

  const getPositionTheme = (position: string) => {
    return positionThemes[position as keyof typeof positionThemes] || {
      primary: '#6b7280',
      secondary: '#9ca3af',
      accent: '#4b5563',
      gradient: 'from-gray-500 via-gray-400 to-gray-600',
      glow: 'shadow-gray-500/50',
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      icon: '👤'
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 shadow-green-500/50';
      case 'injured': return 'bg-red-500/20 text-red-400 shadow-red-500/50';
      case 'suspended': return 'bg-yellow-500/20 text-yellow-400 shadow-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 shadow-gray-500/50';
    }
  };

  // Calculate enhanced stats
  const totalGoals = filteredPlayers.reduce((sum, p) => sum + p.goals, 0);
  const totalAssists = filteredPlayers.reduce((sum, p) => sum + p.assists, 0);
  const avgAppearances = filteredPlayers.length > 0
    ? Math.round(filteredPlayers.reduce((sum, p) => sum + p.appearances, 0) / filteredPlayers.length)
    : 0;
  const activePlayers = filteredPlayers.filter(p => p.status === 'active').length;

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
            Loading Ultra Squad...
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
          headerTitle="Ultra Squad Management"
          headerDescription={`Manage ${userTeam.name}'s elite players with ultra stylish design`}
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/club-admin/players/add')}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              <Sparkles size={20} />
              Add Ultra Player
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* Ultra Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  title: 'Total Players',
                  value: filteredPlayers.length.toString(),
                  icon: <Users size={24} className="text-white" />,
                  gradient: 'from-blue-500 to-cyan-500',
                  glow: 'shadow-blue-500/50',
                  change: '+2',
                  changeType: 'positive' as const
                },
                {
                  title: 'Total Goals',
                  value: totalGoals.toString(),
                  icon: <Target size={24} className="text-white" />,
                  gradient: 'from-emerald-500 to-green-500',
                  glow: 'shadow-emerald-500/50',
                  change: '+12',
                  changeType: 'positive' as const
                },
                {
                  title: 'Avg Appearances',
                  value: avgAppearances.toString(),
                  icon: <Activity size={24} className="text-white" />,
                  gradient: 'from-purple-500 to-violet-500',
                  glow: 'shadow-purple-500/50',
                  change: '+3',
                  changeType: 'positive' as const
                },
                {
                  title: 'Active Players',
                  value: activePlayers.toString(),
                  icon: <Zap size={24} className="text-white" />,
                  gradient: 'from-orange-500 to-red-500',
                  glow: 'shadow-orange-500/50',
                  change: '100%',
                  changeType: 'positive' as const
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
                      <TrendingUp size={12} className="text-green-400" />
                      <span className="text-green-400 text-xs font-medium">{stat.change}</span>
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

            {/* Ultra Search & Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Ultra Search */}
                <div className="flex-1">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.01 }}
                  >
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search ultra players by name, position, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none text-white placeholder-gray-400 backdrop-blur-sm text-lg"
                    />
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <Sparkles size={20} className="text-pink-400" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Ultra Position Filter */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                >
                  <select
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                    className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none text-white backdrop-blur-sm text-lg appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-800">All Positions</option>
                    <option value="Goalkeeper" className="bg-slate-800">⚽ Goalkeeper</option>
                    <option value="Defender" className="bg-slate-800">🛡️ Defender</option>
                    <option value="Midfielder" className="bg-slate-800">⚡ Midfielder</option>
                    <option value="Forward" className="bg-slate-800">🔥 Forward</option>
                  </select>
                  <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </motion.div>

                {/* Ultra Status Filter */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                >
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none text-white backdrop-blur-sm text-lg appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-800">All Status</option>
                    <option value="active" className="bg-slate-800">✅ Active</option>
                    <option value="injured" className="bg-slate-800">🚑 Injured</option>
                    <option value="suspended" className="bg-slate-800">⏸️ Suspended</option>
                  </select>
                  <Activity className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </motion.div>
              </div>
            </motion.div>

            {/* Ultra Players Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {filteredPlayers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <Users size={64} className="text-pink-400/60" />
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
                    No Ultra Players Found
                  </motion.h3>

                  <p className="text-gray-400 mb-8 text-lg">Time to build your championship squad!</p>

                  <motion.button
                    onClick={() => router.push('/club-admin/players/add')}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all inline-flex items-center gap-3"
                  >
                    <Sparkles size={24} />
                    Add Your First Ultra Player
                    <Crown className="text-yellow-400" size={20} />
                  </motion.button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPlayers.map((player, i) => {
                    const theme = getPositionTheme(player.position);
                    return (
                      <motion.div
                        key={player._id || player.id}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.1 + i * 0.1,
                          duration: 0.8,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        whileHover={{
                          y: -8,
                          scale: 1.03,
                          transition: { duration: 0.3 }
                        }}
                        className={`glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl relative overflow-hidden group ${theme.glow} hover:${theme.glow}`}
                      >
                        {/* Dynamic Background */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                        />

                        <div className="relative z-10">
                          {/* Player Header */}
                          <div className="flex items-start gap-4 mb-6">
                            <motion.div
                              className={`w-20 h-20 bg-gradient-to-br ${theme.gradient} rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl group-hover:shadow-xl transition-all border-2 border-white/20`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {player.name.charAt(0)}
                              {/* Position Icon Overlay */}
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-xs">{theme.icon}</span>
                              </div>
                            </motion.div>

                            <div className="flex-1">
                              <motion.h3
                                className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                                whileHover={{ scale: 1.02 }}
                              >
                                {player.name}
                              </motion.h3>

                              <div className="flex items-center gap-2 mb-3">
                                <motion.span
                                  className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r ${theme.gradient} text-white`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {theme.icon} {player.position}
                                </motion.span>
                                <motion.span
                                  className="px-3 py-1 bg-white/10 rounded-lg text-lg font-bold text-white border border-white/20"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  #{player.jerseyNumber}
                                </motion.span>
                              </div>

                              <div className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} className="text-pink-400" />
                                  <span>{player.age} years</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} className="text-blue-400" />
                                  <span>{player.nationality}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Ultra Stats Grid */}
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            {[
                              { label: 'Goals', value: player.goals, icon: '🎯' },
                              { label: 'Assists', value: player.assists, icon: '🤝' },
                              { label: 'Apps', value: player.appearances, icon: '📊' }
                            ].map((stat, idx) => (
                              <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                whileHover={{ scale: 1.1 }}
                                className="text-center p-3 bg-white/5 rounded-xl border border-white/10 group/stat"
                              >
                                <motion.div
                                  className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1"
                                  whileHover={{ scale: 1.2 }}
                                >
                                  {stat.value}
                                </motion.div>
                                <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                                <div className="text-lg group-hover/stat:animate-bounce">{stat.icon}</div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Status and Ultra Actions */}
                          <div className="flex items-center justify-between">
                            <motion.span
                              className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${getStatusColor(player.status)}`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                            </motion.span>

                            <div className="flex gap-3">
                              <motion.button
                                onClick={() => router.push(`/club-admin/players/${player._id || player.id}`)}
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 group"
                                title="View Ultra Details"
                              >
                                <Eye size={18} className="text-gray-300 group-hover:text-white transition-colors" />
                              </motion.button>

                              <motion.button
                                onClick={() => router.push(`/club-admin/players/${player._id || player.id}/edit`)}
                                whileHover={{ scale: 1.2, rotate: -10 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-xl transition-all border border-white/20 group"
                                title="Edit Ultra Player"
                              >
                                <Edit2 size={18} className="text-gray-300 group-hover:text-white transition-colors" />
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Animated Corner Sparkle */}
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5],
                            rotate: [0, 180, 360]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                          className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg"
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
