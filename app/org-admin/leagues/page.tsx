'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
  Trophy,
  Plus,
  Calendar,
  MapPin,
  Users,
  Settings,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Filter,
  Search,
  Crown,
  Sparkles,
  Star,
  Flame,
  Rocket,
  Thunderbolt,
  TrendingUp
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/org-admin', icon: <Trophy size={20} /> },
  { label: 'Leagues', href: '/org-admin/leagues', icon: <Trophy size={20} /> },
  { label: 'Matches', href: '/org-admin/matches', icon: <Trophy size={20} /> },
  { label: 'Settings', href: '/org-admin/settings', icon: <Trophy size={20} /> },
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

export default function LeaguesPage() {
  const router = useRouter();
  const { user, leagues, fetchLeagues, deleteLeague } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadLeagues = async () => {
      if (user?.organization) {
        await fetchLeagues(user.organization.toString());
      }
      setIsLoading(false);
    };
    loadLeagues();
  }, [user, fetchLeagues]);

  const handleDeleteLeague = async (leagueId: string) => {
    if (confirm('Are you sure you want to delete this league? This action cannot be undone.')) {
      try {
        await deleteLeague(leagueId);
      } catch (error) {
        console.error('Failed to delete league:', error);
      }
    }
  };

  const filteredLeagues = leagues.filter(league => {
    const matchesSearch = league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         league.region?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || league.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'league': return '🏆';
      case 'knockout': return '🏅';
      case 'group_stage': return '🎯';
      default: return '🏆';
    }
  };

  return (
    <ProtectedRoute requiredRole="org-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        {/* Ultra Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy className="text-white" size={24} />
                </div>
                <div>
                  <motion.h1
                    className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.02 }}
                  >
                    Leagues
                  </motion.h1>
                  <motion.p
                    className="text-gray-400"
                    whileHover={{ scale: 1.01 }}
                  >
                    Manage your organization's competitions
                  </motion.p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Crown className="w-8 h-8 text-yellow-400" />
                </motion.div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/org-admin/leagues/create')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Plus size={20} />
                Create League
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={16} />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Ultra Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Ultra Search */}
              <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Search className="text-white" size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search leagues by name or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-white/30 focus:ring-2 focus:ring-white/20 outline-none text-white placeholder-gray-400 hover:bg-white/10 transition-all"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                  className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full shadow-lg"
                />
              </div>

              {/* Ultra Status Filter */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Filter className="text-white" size={16} />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-white/30 focus:ring-2 focus:ring-white/20 outline-none text-white hover:bg-white/10 transition-all appearance-none"
                >
                  <option value="all" className="bg-slate-900 text-white">All Status</option>
                  <option value="draft" className="bg-slate-900 text-white">Draft</option>
                  <option value="active" className="bg-slate-900 text-white">Active</option>
                  <option value="completed" className="bg-slate-900 text-white">Completed</option>
                </select>
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.7, 0.2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 1
                  }}
                  className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full shadow-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Ultra Leagues Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading leagues...</p>
              </div>
            </div>
          ) : filteredLeagues.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 glass-card p-12 rounded-3xl border border-white/10 backdrop-blur-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-yellow-400/60" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">No Leagues Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating your first league.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => router.push('/org-admin/leagues/create')}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Create Your First League
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeagues.map((league, index) => (
                <motion.div
                  key={league._id || league.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.2 + index * 0.05,
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
                        <span className="text-2xl">{getFormatIcon(league.type?.format || 'league')}</span>
                      </div>
                      <motion.button
                        onClick={() => router.push('/org-admin/leagues')}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all"
                      >
                        <MoreVertical size={18} className="text-gray-300 group-hover:text-white transition-colors" />
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
                        Format: {(league.type?.format || 'league').replace('_', ' ')}
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

                    {league.tier && (
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded text-xs border border-purple-400/30">
                          Tier {league.tier}
                        </span>
                      </div>
                    )}
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
                      delay: index * 0.3
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
                      delay: index * 0.7
                    }}
                    className="absolute bottom-4 right-4 w-2 h-2 bg-orange-400 rounded-full shadow-lg"
                  />

                  {/* Actions Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => router.push(`/org-admin/leagues/${league._id || league.id}/manage`)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <Settings size={14} />
                        Manage
                      </motion.button>
                      <motion.button
                        onClick={() => router.push(`/org-admin/leagues/${league._id || league.id}/edit`)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all"
                      >
                        <Edit size={14} className="text-gray-300 group-hover:text-white transition-colors" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteLeague(league._id || league.id!)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Create New League Card */}
              <motion.button
                onClick={() => router.push('/org-admin/leagues/create')}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + filteredLeagues.length * 0.1 }}
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
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
