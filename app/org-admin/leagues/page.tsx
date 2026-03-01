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
  Search
} from 'lucide-react';

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Trophy className="text-accent" size={32} />
                  Leagues
                </h1>
                <p className="text-muted-foreground">Manage your organization's competitions</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/org-admin/leagues/create')}
                className="px-6 py-3 bg-gradient-to-r from-accent to-secondary text-accent-foreground font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={20} />
                Create League
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 glass-card p-6 rounded-2xl"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search leagues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Leagues Grid */}
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
              className="text-center py-20 glass-card p-12 rounded-2xl"
            >
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-2">No Leagues Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating your first league.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => router.push('/org-admin/leagues/create')}
                  className="px-6 py-3 bg-gradient-to-r from-accent to-secondary text-accent-foreground font-bold rounded-xl hover:shadow-lg transition-all duration-300"
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group"
                >
                  {/* League Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center text-2xl">
                        {getFormatIcon(league.type.format)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-accent transition-colors">
                          {league.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {league.year}
                          </span>
                          {league.region && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {league.region}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(league.status)}`}>
                        {league.status}
                      </span>
                      <div className="relative">
                        <button className="p-2 hover:bg-accent/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* League Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium capitalize">{league.type.format.replace('_', ' ')}</span>
                    </div>

                    {league.tier && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tier</span>
                        <span className="font-medium">{league.tier}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Home & Away</span>
                      <span className="font-medium">{league.type.hasHomeAway ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/org-admin/leagues/${league._id || league.id}/manage`)}
                      className="flex-1 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings size={16} />
                      Manage League
                    </button>
                    <button
                      onClick={() => router.push(`/org-admin/leagues/${league._id || league.id}/edit`)}
                      className="px-4 py-2 bg-card hover:bg-card/80 border border-border rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteLeague(league._id || league.id!)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
