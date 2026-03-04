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
  Star
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

  // Mock team stats
  const stats = [
    {
      title: 'Total Matches',
      value: totalMatches.toString(),
      icon: '⚽',
      trend: { value: 2, isPositive: true },
      color: 'blue' as const,
    },
    {
      title: 'Wins',
      value: wonMatches.toString(),
      icon: '🏆',
      trend: { value: 1, isPositive: true },
      color: 'green' as const,
    },
    {
      title: 'Win Rate',
      value: `${winRate}%`,
      icon: '📊',
      trend: { value: 5, isPositive: winRate > 50 },
      color: 'gold' as const,
    },
    {
      title: 'Active Players',
      value: userTeam?.playersCount?.toString() || '22',
      icon: '👥',
      trend: { value: 0, isPositive: true },
      color: 'red' as const,
    },
  ];

  // Recent matches for this team
  const recentMatches = teamMatches.slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading club dashboard...</p>
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
              You haven't been assigned to manage a team yet. Please contact your league administrator.
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
          headerTitle={`${userTeam.name} Dashboard`}
          headerDescription="Manage your team's operations, players, and performance"
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
            {/* Team Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  {userTeam.logo ? (
                    <img src={userTeam.logo} alt={userTeam.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    userTeam.name.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {userTeam.name}
                  </h2>
                  <div className="flex items-center gap-6 text-muted-foreground mb-4">
                    <span className="flex items-center gap-2">
                      <Calendar size={18} />
                      Founded {userTeam.founded}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={18} />
                      {userTeam.location}
                    </span>
                    {userTeam.stadium && (
                      <span className="flex items-center gap-2">
                        <Flag size={18} />
                        {userTeam.stadium}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      userTeam.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : userTeam.status === 'inactive'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}>
                      {userTeam.status.charAt(0).toUpperCase() + userTeam.status.slice(1)}
                    </span>
                    <span className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm font-semibold">
                      Club Admin
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, i) => (
                <StatCard
                  key={i}
                  {...stat}
                  delay={i * 0.1}
                />
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.button
                onClick={() => router.push('/club-admin/profile')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Users className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Team Profile</h3>
                    <p className="text-sm text-muted-foreground">Update team information</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/club-admin/players')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <UserPlus className="text-green-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Manage Players</h3>
                    <p className="text-sm text-muted-foreground">Add and manage squad</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/club-admin/matches')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                    <Zap className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">View Matches</h3>
                    <p className="text-sm text-muted-foreground">Upcoming and results</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => router.push('/club-admin/stats')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card p-6 rounded-xl text-left hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <TrendingUp className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Performance</h3>
                    <p className="text-sm text-muted-foreground">View statistics</p>
                  </div>
                </div>
              </motion.button>
            </motion.div>

            {/* Recent Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Recent Matches</h3>
                <motion.button
                  onClick={() => router.push('/club-admin/matches')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-accent hover:text-accent/80 font-semibold text-sm"
                >
                  View All →
                </motion.button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {recentMatches.length > 0 ? recentMatches.map((match) => (
                  <motion.div
                    key={match.id}
                    whileHover={{ x: 4 }}
                    className="glass-card p-6 rounded-xl flex items-center justify-between hover:shadow-lg transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className={`font-semibold ${match.homeTeam === userTeam.name ? 'text-accent' : 'text-foreground'}`}>
                          {match.homeTeam}
                        </span>
                        <span className="text-2xl font-bold text-accent">
                          {match.homeScore}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-2xl font-bold text-accent">
                          {match.awayScore}
                        </span>
                        <span className={`font-semibold ${match.awayTeam === userTeam.name ? 'text-accent' : 'text-foreground'}`}>
                          {match.awayTeam}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(match.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {match.venue || 'TBD'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          match.status === 'live'
                            ? 'bg-red-500/20 text-red-400 animate-pulse'
                            : match.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                      <motion.button
                        onClick={() => router.push(`/club-admin/matches/${match.id}`)}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 hover:bg-card rounded-lg transition-colors"
                      >
                        <Eye size={18} className="text-muted-foreground" />
                      </motion.button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="glass-card p-8 rounded-xl text-center">
                    <Zap size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h4 className="font-semibold mb-2">No Matches Yet</h4>
                    <p className="text-muted-foreground mb-4">Your upcoming matches will appear here</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Team Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Current Season Stats */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-accent" />
                  Season Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Matches Played</span>
                    <span className="font-semibold">{totalMatches}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Wins</span>
                    <span className="font-semibold text-green-400">{wonMatches}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Draws</span>
                    <span className="font-semibold text-yellow-400">{drawnMatches}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Losses</span>
                    <span className="font-semibold text-red-400">{lostMatches}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-medium">Win Rate</span>
                    <span className="font-bold text-accent">{winRate}%</span>
                  </div>
                </div>
              </div>

              {/* Team Goals */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target size={20} className="text-accent" />
                  Team Goals
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Improve Win Rate</p>
                      <p className="text-xs text-muted-foreground">Target: 65% (Current: {winRate}%)</p>
                    </div>
                    <div className="w-16 h-2 bg-card rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.min((winRate / 65) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Player Development</p>
                      <p className="text-xs text-muted-foreground">Youth players promoted</p>
                    </div>
                    <div className="w-16 h-2 bg-card rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Fan Engagement</p>
                      <p className="text-xs text-muted-foreground">Social media growth</p>
                    </div>
                    <div className="w-16 h-2 bg-card rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
