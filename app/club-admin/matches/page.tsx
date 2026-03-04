'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Users,
  Eye,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/club-admin', icon: <Users size={20} /> },
  { label: 'Team Profile', href: '/club-admin/profile', icon: <Users size={20} /> },
  { label: 'Players', href: '/club-admin/players', icon: <Users size={20} /> },
  { label: 'Matches', href: '/club-admin/matches', icon: <Zap size={20} /> },
  { label: 'Statistics', href: '/club-admin/stats', icon: <Users size={20} /> },
  { label: 'Settings', href: '/club-admin/settings', icon: <Users size={20} /> },
];

// Mock match data
const mockMatches = [
  {
    id: '1',
    homeTeam: 'Dedebit FC',
    awayTeam: 'Awash International',
    homeScore: 2,
    awayScore: 1,
    date: '2024-01-20T15:00:00Z',
    venue: 'Addis Ababa Stadium',
    status: 'completed',
    league: 'Ethiopian Premier League',
    round: 'Round 15',
  },
  {
    id: '2',
    homeTeam: 'Dedebit FC',
    awayTeam: 'Ethiopian Coffee',
    homeScore: null,
    awayScore: null,
    date: '2024-01-27T16:00:00Z',
    venue: 'Addis Ababa Stadium',
    status: 'scheduled',
    league: 'Ethiopian Premier League',
    round: 'Round 16',
  },
  {
    id: '3',
    homeTeam: 'Adama City',
    awayTeam: 'Dedebit FC',
    homeScore: 1,
    awayScore: 1,
    date: '2024-01-10T14:30:00Z',
    venue: 'Adama Stadium',
    status: 'completed',
    league: 'Ethiopian Premier League',
    round: 'Round 14',
  },
  {
    id: '4',
    homeTeam: 'Dedebit FC',
    awayTeam: 'Dire Dawa City',
    homeScore: 0,
    awayScore: 0,
    date: '2024-01-03T15:00:00Z',
    venue: 'Addis Ababa Stadium',
    status: 'completed',
    league: 'Ethiopian Premier League',
    round: 'Round 13',
  },
];

export default function ClubAdminMatchesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const { user, teams, matches } = useAppStore();

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

  // Get team's matches
  const teamMatches = mockMatches.filter(match =>
    match.homeTeam === userTeam?.name || match.awayTeam === userTeam?.name
  );

  // Filter matches based on selected filter
  const filteredMatches = teamMatches.filter(match => {
    if (filter === 'upcoming') return match.status === 'scheduled';
    if (filter === 'completed') return match.status === 'completed';
    return true;
  });

  // Sort matches by date (most recent first)
  const sortedMatches = filteredMatches.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate match statistics
  const totalMatches = teamMatches.length;
  const completedMatches = teamMatches.filter(m => m.status === 'completed').length;
  const upcomingMatches = teamMatches.filter(m => m.status === 'scheduled').length;
  const homeWins = teamMatches.filter(m =>
    m.status === 'completed' &&
    m.homeTeam === userTeam?.name &&
    m.homeScore !== null && m.awayScore !== null && m.homeScore > m.awayScore
  ).length;
  const awayWins = teamMatches.filter(m =>
    m.status === 'completed' &&
    m.awayTeam === userTeam?.name &&
    m.awayScore !== null && m.homeScore !== null && m.awayScore > m.homeScore
  ).length;
  const draws = teamMatches.filter(m =>
    m.status === 'completed' && m.homeScore !== null && m.awayScore !== null && m.homeScore === m.awayScore
  ).length;

  const totalWins = homeWins + awayWins;
  const winRate = completedMatches > 0 ? Math.round((totalWins / completedMatches) * 100) : 0;

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
          headerTitle="Match Results & Schedule"
          headerDescription={`View ${userTeam.name}'s match history and upcoming fixtures`}
          navItems={navItems}
        >
          <div className="space-y-8">
            {/* Match Statistics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="text-blue-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{totalMatches}</h3>
                <p className="text-muted-foreground text-sm">Total Matches</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="text-green-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{totalWins}</h3>
                <p className="text-muted-foreground text-sm">Wins</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="text-yellow-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{draws}</h3>
                <p className="text-muted-foreground text-sm">Draws</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="text-purple-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{winRate}%</h3>
                <p className="text-muted-foreground text-sm">Win Rate</p>
              </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-2"
            >
              {[
                { key: 'all', label: 'All Matches', count: totalMatches },
                { key: 'upcoming', label: 'Upcoming', count: upcomingMatches },
                { key: 'completed', label: 'Completed', count: completedMatches },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    filter === tab.key
                      ? 'bg-accent text-accent-foreground shadow-lg'
                      : 'bg-card hover:bg-card/80 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    filter === tab.key
                      ? 'bg-accent-foreground/20 text-accent-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Matches List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {sortedMatches.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar size={48} className="text-accent/60" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                    {filter === 'upcoming' ? 'No Upcoming Matches' : filter === 'completed' ? 'No Completed Matches' : 'No Matches Found'}
                  </h3>
                  <p className="text-muted-foreground/80">
                    {filter === 'upcoming' ? 'Your upcoming matches will appear here' : 'Match results will appear here'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedMatches.map((match, i) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {/* Match Header */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-sm text-muted-foreground font-medium">
                              {match.league} • {match.round}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                match.status === 'completed'
                                  ? 'bg-green-500/20 text-green-400'
                                  : match.status === 'live'
                                    ? 'bg-red-500/20 text-red-400 animate-pulse'
                                    : 'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                            </span>
                          </div>

                          {/* Teams and Score */}
                          <div className="flex items-center gap-8 mb-4">
                            <div className="flex-1 text-center">
                              <h3 className={`text-xl font-bold mb-2 ${
                                match.homeTeam === userTeam.name ? 'text-accent' : 'text-foreground'
                              }`}>
                                {match.homeTeam}
                              </h3>
                              {match.status === 'completed' && (
                                <div className="text-3xl font-bold text-accent">
                                  {match.homeScore}
                                </div>
                              )}
                            </div>

                            <div className="text-center">
                              <div className="text-2xl font-bold text-muted-foreground mb-2">VS</div>
                              {match.status === 'completed' && (
                                <div className="text-sm text-muted-foreground">
                                  {match.homeScore !== null && match.awayScore !== null && (
                                    match.homeScore > match.awayScore
                                      ? `${match.homeTeam} Won`
                                      : match.awayScore > match.homeScore
                                        ? `${match.awayTeam} Won`
                                        : 'Draw'
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 text-center">
                              <h3 className={`text-xl font-bold mb-2 ${
                                match.awayTeam === userTeam.name ? 'text-accent' : 'text-foreground'
                              }`}>
                                {match.awayTeam}
                              </h3>
                              {match.status === 'completed' && (
                                <div className="text-3xl font-bold text-accent">
                                  {match.awayScore}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Match Details */}
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              <span>
                                {new Date(match.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              <span>
                                {new Date(match.date).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              <span>{match.venue}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 ml-6">
                          <motion.button
                            onClick={() => router.push(`/club-admin/matches/${match.id}`)}
                            whileHover={{ scale: 1.1 }}
                            className="p-3 hover:bg-card rounded-lg transition-colors"
                            title="View Match Details"
                          >
                            <Eye size={20} className="text-muted-foreground" />
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
