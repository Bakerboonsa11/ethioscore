'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  Star
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

// Mock player data - in real app this would come from database
const mockPlayers = [
  {
    id: '1',
    name: 'Abebe Kebede',
    position: 'Forward',
    jerseyNumber: 9,
    age: 25,
    nationality: 'Ethiopian',
    email: 'abebe@example.com',
    phone: '+251911123456',
    status: 'active',
    goals: 12,
    assists: 8,
    appearances: 18,
    joinedDate: '2023-01-15',
    contractEnd: '2025-12-31',
  },
  {
    id: '2',
    name: 'Mekonnen Tadesse',
    position: 'Midfielder',
    jerseyNumber: 7,
    age: 28,
    nationality: 'Ethiopian',
    email: 'mekonnen@example.com',
    phone: '+251922654321',
    status: 'active',
    goals: 5,
    assists: 15,
    appearances: 22,
    joinedDate: '2022-08-10',
    contractEnd: '2024-06-30',
  },
  {
    id: '3',
    name: 'Dawit Mengistu',
    position: 'Defender',
    jerseyNumber: 4,
    age: 30,
    nationality: 'Ethiopian',
    email: 'dawit@example.com',
    phone: '+251933789123',
    status: 'injured',
    goals: 2,
    assists: 3,
    appearances: 20,
    joinedDate: '2021-03-20',
    contractEnd: '2025-12-31',
  },
  {
    id: '4',
    name: 'Solomon Gebremariam',
    position: 'Goalkeeper',
    jerseyNumber: 1,
    age: 32,
    nationality: 'Ethiopian',
    email: 'solomon@example.com',
    phone: '+251944567890',
    status: 'active',
    goals: 0,
    assists: 1,
    appearances: 24,
    joinedDate: '2020-01-01',
    contractEnd: '2024-12-31',
  },
];

export default function ClubAdminPlayersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const { user, teams } = useAppStore();

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

  // Filter players based on search and filters
  const filteredPlayers = mockPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
    const matchesStatus = statusFilter === 'all' || player.status === statusFilter;

    return matchesSearch && matchesPosition && matchesStatus;
  });

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Goalkeeper': return 'bg-yellow-500/20 text-yellow-400';
      case 'Defender': return 'bg-blue-500/20 text-blue-400';
      case 'Midfielder': return 'bg-green-500/20 text-green-400';
      case 'Forward': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'injured': return 'bg-red-500/20 text-red-400';
      case 'suspended': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading players...</p>
        </div>
      </div>
    );
  }

  if (!userTeam) {
    return (
      <ProtectedRoute requiredRole="club-admin">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center glass-card p-8 rounded-2xl max-w-md mx-4">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Team Not Assigned</h2>
            <p className="text-muted-foreground mb-6">
              You haven't been assigned to manage a team yet.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="club-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="Club Admin"
          headerTitle="Player Management"
          headerDescription={`Manage ${userTeam.name}'s squad and player information`}
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/club-admin/players/add')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus size={20} />
              Add Player
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* Players Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="text-blue-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{filteredPlayers.length}</h3>
                <p className="text-muted-foreground text-sm">Total Players</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="text-green-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {filteredPlayers.reduce((sum, p) => sum + p.goals, 0)}
                </h3>
                <p className="text-muted-foreground text-sm">Total Goals</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="text-purple-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {Math.round(filteredPlayers.reduce((sum, p) => sum + p.appearances, 0) / filteredPlayers.length) || 0}
                </h3>
                <p className="text-muted-foreground text-sm">Avg Appearances</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="text-orange-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {filteredPlayers.filter(p => p.status === 'active').length}
                </h3>
                <p className="text-muted-foreground text-sm">Active Players</p>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Search players by name, position, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              >
                <option value="all">All Positions</option>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="injured">Injured</option>
                <option value="suspended">Suspended</option>
              </select>
            </motion.div>

            {/* Players Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {filteredPlayers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users size={48} className="text-accent/60" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">No Players Found</h3>
                  <p className="text-muted-foreground/80 mb-6">Try adjusting your search criteria or add new players</p>
                  <motion.button
                    onClick={() => router.push('/club-admin/players/add')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
                  >
                    Add First Player
                  </motion.button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlayers.map((player, i) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.1 + i * 0.05,
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{
                        y: -4,
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all group"
                    >
                      {/* Player Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                          {player.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{player.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPositionColor(player.position)}`}>
                              {player.position}
                            </span>
                            <span className="text-lg font-bold text-accent">#{player.jerseyNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            <span>{player.age} years old</span>
                            <span>•</span>
                            <MapPin size={14} />
                            <span>{player.nationality}</span>
                          </div>
                        </div>
                      </div>

                      {/* Player Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">{player.goals}</div>
                          <div className="text-xs text-muted-foreground">Goals</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">{player.assists}</div>
                          <div className="text-xs text-muted-foreground">Assists</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">{player.appearances}</div>
                          <div className="text-xs text-muted-foreground">Apps</div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(player.status)}`}>
                          {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                        </span>
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => router.push(`/club-admin/players/${player.id}`)}
                            whileHover={{ scale: 1.1 }}
                            className="p-2 hover:bg-card rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} className="text-muted-foreground" />
                          </motion.button>
                          <motion.button
                            onClick={() => router.push(`/club-admin/players/${player.id}/edit`)}
                            whileHover={{ scale: 1.1 }}
                            className="p-2 hover:bg-card rounded-lg transition-colors"
                            title="Edit Player"
                          >
                            <Edit2 size={16} className="text-muted-foreground" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
