'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Plus, Edit2, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/league-admin', icon: <Trophy size={20} /> },
  { label: 'Teams', href: '/league-admin/teams', icon: <Users size={20} /> },
  { label: 'Matches', href: '/league-admin/matches', icon: <Trophy size={20} /> },
  { label: 'Referees', href: '/league-admin/referees', icon: <Users size={20} /> },
  { label: 'Settings', href: '/league-admin/settings', icon: <Users size={20} /> },
];

export default function LeagueAdminMatchesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { user, leagues, matches } = useAppStore();

  // Get the league that this admin manages
  const userLeague = leagues.find(league =>
    league._id === user?.league?._id || league.id === user?.league?.id
  );

  // Get matches for this league
  const leagueMatches = matches.filter(match =>
    match.leagueId === userLeague?.id || match.leagueId === userLeague?._id
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  if (!userLeague) {
    return (
      <ProtectedRoute requiredRole="league-admin">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">League Not Found</h2>
            <p className="text-muted-foreground">You are not assigned to any league.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Group matches by status
  const upcomingMatches = leagueMatches.filter(match => match.status === 'scheduled');
  const liveMatches = leagueMatches.filter(match => match.status === 'live');
  const completedMatches = leagueMatches.filter(match => match.status === 'completed');

  return (
    <ProtectedRoute requiredRole="league-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="League Admin"
          headerTitle="Match Management"
          headerDescription={`Manage matches for ${userLeague.name}`}
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/league-admin/matches/create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus size={20} />
              Schedule Match
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* Match Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="text-blue-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{upcomingMatches.length}</h3>
                <p className="text-muted-foreground text-sm">Upcoming Matches</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="text-red-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{liveMatches.length}</h3>
                <p className="text-muted-foreground text-sm">Live Matches</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-green-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{completedMatches.length}</h3>
                <p className="text-muted-foreground text-sm">Completed Matches</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MapPin className="text-purple-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{leagueMatches.length}</h3>
                <p className="text-muted-foreground text-sm">Total Matches</p>
              </div>
            </motion.div>

            {/* Live Matches */}
            {liveMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-red-400">🔴 Live Matches</h3>
                <div className="grid grid-cols-1 gap-4">
                  {liveMatches.map((match) => (
                    <motion.div
                      key={match.id}
                      whileHover={{ x: 4 }}
                      className="glass-card p-6 rounded-xl flex items-center justify-between bg-red-500/5 border-red-500/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-semibold text-foreground">{match.homeTeam}</span>
                          <span className="text-2xl font-bold text-accent">
                            {match.homeScore}
                          </span>
                          <span className="text-muted-foreground">-</span>
                          <span className="text-2xl font-bold text-accent">
                            {match.awayScore}
                          </span>
                          <span className="font-semibold text-foreground">{match.awayTeam}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {match.venue || 'Venue TBD'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            Live
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold animate-pulse">
                          LIVE
                        </span>
                        <motion.button
                          onClick={() => router.push(`/league-admin/matches/${match.id}/live`)}
                          whileHover={{ scale: 1.1 }}
                          className="p-2 hover:bg-card rounded-lg transition-colors"
                        >
                          <Edit2 size={18} className="text-muted-foreground" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Upcoming Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold">Upcoming Matches</h3>
              <div className="grid grid-cols-1 gap-4">
                {upcomingMatches.length > 0 ? upcomingMatches.map((match) => (
                  <motion.div
                    key={match.id}
                    whileHover={{ x: 4 }}
                    className="glass-card p-6 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-semibold text-foreground">{match.homeTeam}</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="font-semibold text-foreground">{match.awayTeam}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(match.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(match.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {match.venue || 'Venue TBD'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold">
                        Scheduled
                      </span>
                      <motion.button
                        onClick={() => router.push(`/league-admin/matches/${match.id}/edit`)}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 hover:bg-card rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-muted-foreground" />
                      </motion.button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="glass-card p-8 rounded-xl text-center">
                    <Calendar size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h4 className="font-semibold mb-2">No Upcoming Matches</h4>
                    <p className="text-muted-foreground mb-4">Schedule your first match to get started</p>
                    <motion.button
                      onClick={() => router.push('/league-admin/matches/create')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
                    >
                      Schedule First Match
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Results */}
            {completedMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold">Recent Results</h3>
                <div className="grid grid-cols-1 gap-4">
                  {completedMatches.slice(0, 5).map((match) => (
                    <motion.div
                      key={match.id}
                      whileHover={{ x: 4 }}
                      className="glass-card p-6 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-semibold text-foreground">{match.homeTeam}</span>
                          <span className="text-2xl font-bold text-accent">
                            {match.homeScore}
                          </span>
                          <span className="text-muted-foreground">-</span>
                          <span className="text-2xl font-bold text-accent">
                            {match.awayScore}
                          </span>
                          <span className="font-semibold text-foreground">{match.awayTeam}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={16} />
                          {new Date(match.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
                          Completed
                        </span>
                        <motion.button
                          onClick={() => router.push(`/league-admin/matches/${match.id}`)}
                          whileHover={{ scale: 1.1 }}
                          className="p-2 hover:bg-card rounded-lg transition-colors"
                        >
                          <Edit2 size={18} className="text-muted-foreground" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
