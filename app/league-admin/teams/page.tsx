'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Plus, Edit2, Trophy, MapPin, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/league-admin', icon: <Users size={20} /> },
  { label: 'Teams', href: '/league-admin/teams', icon: <Users size={20} /> },
  { label: 'Matches', href: '/league-admin/matches', icon: <Trophy size={20} /> },
  { label: 'Referees', href: '/league-admin/referees', icon: <Users size={20} /> },
  { label: 'Settings', href: '/league-admin/settings', icon: <Users size={20} /> },
];

export default function LeagueAdminTeamsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { user, leagues } = useAppStore();

  // Get the league that this admin manages
  const userLeague = leagues.find(league =>
    league._id === user?.league?._id || league.id === user?.league?.id
  );

  // Mock teams data
  const mockTeams = [
    {
      id: '1',
      name: 'Arsenal FC',
      location: 'London',
      founded: 1886,
      stadium: 'Emirates Stadium',
      players: 25,
      manager: 'Mikel Arteta',
      status: 'active'
    },
    {
      id: '2',
      name: 'Chelsea FC',
      location: 'London',
      founded: 1905,
      stadium: 'Stamford Bridge',
      players: 28,
      manager: 'Mauricio Pochettino',
      status: 'active'
    },
    {
      id: '3',
      name: 'Liverpool FC',
      location: 'Liverpool',
      founded: 1892,
      stadium: 'Anfield',
      players: 26,
      manager: 'Jurgen Klopp',
      status: 'active'
    },
    {
      id: '4',
      name: 'Manchester City',
      location: 'Manchester',
      founded: 1880,
      stadium: 'Etihad Stadium',
      players: 27,
      manager: 'Pep Guardiola',
      status: 'active'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading teams...</p>
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

  return (
    <ProtectedRoute requiredRole="league-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="League Admin"
          headerTitle="Team Management"
          headerDescription={`Manage teams for ${userLeague.name}`}
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/league-admin/teams/create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Plus size={20} />
              Add Team
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* Teams Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="text-green-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{mockTeams.length}</h3>
                <p className="text-muted-foreground text-sm">Total Teams</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="text-blue-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{mockTeams.reduce((sum, team) => sum + team.players, 0)}</h3>
                <p className="text-muted-foreground text-sm">Total Players</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MapPin className="text-orange-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{new Set(mockTeams.map(team => team.location)).size}</h3>
                <p className="text-muted-foreground text-sm">Cities</p>
              </div>
              <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="text-purple-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{Math.min(...mockTeams.map(team => team.founded))}</h3>
                <p className="text-muted-foreground text-sm">Oldest Club</p>
              </div>
            </motion.div>

            {/* Teams Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold">League Teams</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTeams.map((team, i) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="glass-card p-6 rounded-xl group hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-lg">
                          {team.name.charAt(0)}
                        </span>
                      </div>
                      <motion.button
                        onClick={() => router.push(`/league-admin/teams/${team.id}/edit`)}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 hover:bg-card rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-muted-foreground" />
                      </motion.button>
                    </div>

                    <h4 className="text-lg font-bold mb-2">{team.name}</h4>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <p className="flex items-center gap-2">
                        <MapPin size={14} />
                        {team.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar size={14} />
                        Founded {team.founded}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users size={14} />
                        {team.players} players
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-accent">
                        {team.manager}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* Add New Team Card */}
                <motion.button
                  onClick={() => router.push('/league-admin/teams/create')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + mockTeams.length * 0.1 }}
                  className="glass-card p-6 rounded-xl flex items-center justify-center min-h-48 hover:border-accent transition-colors border border-border hover:border-accent"
                >
                  <div className="text-center">
                    <Plus size={32} className="text-accent mx-auto mb-2" />
                    <p className="font-semibold">Add New Team</p>
                    <p className="text-sm text-muted-foreground">Register a team to the league</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
