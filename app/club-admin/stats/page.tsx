'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Trophy,
  Target,
  Users,
  BarChart3,
  Activity,
  Calendar,
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
  { label: 'Matches', href: '/club-admin/matches', icon: <Users size={20} /> },
  { label: 'Statistics', href: '/club-admin/stats', icon: <BarChart3 size={20} /> },
  { label: 'Settings', href: '/club-admin/settings', icon: <Users size={20} /> },
];

// Mock statistics data
const teamStats = {
  season: '2023/2024',
  matchesPlayed: 18,
  wins: 12,
  draws: 4,
  losses: 2,
  goalsFor: 34,
  goalsAgainst: 18,
  goalDifference: 16,
  points: 40,
  position: 2,
  winRate: 67,
  cleanSheets: 8,
  avgGoalsPerMatch: 1.89,
  homeWins: 7,
  awayWins: 5,
};

const playerStats = [
  { name: 'Abebe Kebede', position: 'Forward', goals: 12, assists: 8, appearances: 18 },
  { name: 'Mekonnen Tadesse', position: 'Midfielder', goals: 5, assists: 15, appearances: 22 },
  { name: 'Dawit Mengistu', position: 'Defender', goals: 2, assists: 3, appearances: 20 },
  { name: 'Solomon Gebremariam', position: 'Goalkeeper', goals: 0, assists: 1, appearances: 24 },
];

export default function ClubAdminStatsPage() {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading statistics...</p>
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
          headerTitle="Team Statistics"
          headerDescription={`Performance analytics for ${userTeam.name} - ${teamStats.season}`}
          navItems={navItems}
        >
          <div className="space-y-8">
            {/* Key Performance Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="text-green-500" size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-1">{teamStats.points}</h3>
                <p className="text-muted-foreground text-sm">League Points</p>
                <div className="mt-2 text-xs text-accent font-semibold">
                  Position #{teamStats.position}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="text-blue-500" size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-1">{teamStats.winRate}%</h3>
                <p className="text-muted-foreground text-sm">Win Rate</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {teamStats.wins}W - {teamStats.draws}D - {teamStats.losses}L
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="text-purple-500" size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-1">{teamStats.avgGoalsPerMatch}</h3>
                <p className="text-muted-foreground text-sm">Avg Goals/Match</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {teamStats.goalsFor} GF - {teamStats.goalsAgainst} GA
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Activity className="text-orange-500" size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-1">{teamStats.cleanSheets}</h3>
                <p className="text-muted-foreground text-sm">Clean Sheets</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {Math.round((teamStats.cleanSheets / teamStats.matchesPlayed) * 100)}% match rate
                </div>
              </div>
            </motion.div>

            {/* Season Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Match Results Breakdown */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-accent" />
                  Match Results
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Matches</span>
                    <span className="font-semibold">{teamStats.matchesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-400">Wins</span>
                    <span className="font-semibold text-green-400">{teamStats.wins}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400">Draws</span>
                    <span className="font-semibold text-yellow-400">{teamStats.draws}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-400">Losses</span>
                    <span className="font-semibold text-red-400">{teamStats.losses}</span>
                  </div>
                  <div className="h-px bg-border my-4"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Home Wins</span>
                    <span className="font-semibold">{teamStats.homeWins}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Away Wins</span>
                    <span className="font-semibold">{teamStats.awayWins}</span>
                  </div>
                </div>
              </div>

              {/* Goals Statistics */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target size={20} className="text-accent" />
                  Goals Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Goals Scored</span>
                    <span className="font-semibold text-green-400">{teamStats.goalsFor}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Goals Conceded</span>
                    <span className="font-semibold text-red-400">{teamStats.goalsAgainst}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Goal Difference</span>
                    <span className={`font-semibold ${teamStats.goalDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {teamStats.goalDifference >= 0 ? '+' : ''}{teamStats.goalDifference}
                    </span>
                  </div>
                  <div className="h-px bg-border my-4"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg Goals/Game</span>
                    <span className="font-semibold">{teamStats.avgGoalsPerMatch}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Clean Sheets</span>
                    <span className="font-semibold text-blue-400">{teamStats.cleanSheets}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users size={20} className="text-accent" />
                Top Performers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Player</th>
                      <th className="text-center py-3 px-4 font-semibold">Position</th>
                      <th className="text-center py-3 px-4 font-semibold">Goals</th>
                      <th className="text-center py-3 px-4 font-semibold">Assists</th>
                      <th className="text-center py-3 px-4 font-semibold">Appearances</th>
                      <th className="text-center py-3 px-4 font-semibold">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStats.map((player, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-sm font-bold">
                              {player.name.charAt(0)}
                            </div>
                            <span className="font-medium">{player.name}</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4 text-muted-foreground">{player.position}</td>
                        <td className="text-center py-3 px-4 font-semibold text-green-400">{player.goals}</td>
                        <td className="text-center py-3 px-4 font-semibold text-blue-400">{player.assists}</td>
                        <td className="text-center py-3 px-4">{player.appearances}</td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="font-semibold">
                              {((player.goals * 2 + player.assists) / Math.max(player.appearances, 1)).toFixed(1)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Performance Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="glass-card p-6 rounded-2xl text-center">
                <h4 className="font-semibold mb-4">Recent Form</h4>
                <div className="flex justify-center gap-1 mb-4">
                  {['W', 'W', 'D', 'W', 'L'].map((result, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        result === 'W' ? 'bg-green-500 text-white' :
                        result === 'D' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Last 5 matches</p>
              </div>

              <div className="glass-card p-6 rounded-2xl text-center">
                <h4 className="font-semibold mb-4">Home vs Away</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{teamStats.homeWins}</div>
                    <div className="text-sm text-muted-foreground">Home Wins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{teamStats.awayWins}</div>
                    <div className="text-sm text-muted-foreground">Away Wins</div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl text-center">
                <h4 className="font-semibold mb-4">Season Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Matches Played</span>
                    <span>{teamStats.matchesPlayed}/30</span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{ width: `${(teamStats.matchesPlayed / 30) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {30 - teamStats.matchesPlayed} matches remaining
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
