'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Plus, Edit2, Calendar, MapPin, Clock, Users, Crown, Sparkles, Star, Flame, Rocket, Zap, TrendingUp, Eye } from 'lucide-react';
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

// Group colors for different groups
const groupColors = {
  'Group 1': {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-400/30'
  },
  'Group 2': {
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-400/30'
  },
  'Group 3': {
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-400/30'
  },
  'Group 4': {
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-400/30'
  },
  'Group 5': {
    gradient: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-400/30'
  }
};

export default function LeagueAdminMatchesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [matchesFetched, setMatchesFetched] = useState(false);
  const [showGroupCreation, setShowGroupCreation] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isCreatingGroups, setIsCreatingGroups] = useState(false);

  const { user, leagues, matches, fetchMatches, fetchLeagues, teams, setTeams, groups, fetchGroups, createGroup } = useAppStore();

  // Get the league that this admin manages
  const userLeague = leagues.find(league => {
    const leagueRef = user?.league;
    if (typeof leagueRef === 'string') {
      return league._id === leagueRef || league.id === leagueRef;
    } else {
      return league._id === leagueRef?._id;
    }
  });

  // Get matches for this league - filter by leagueId (only if userLeague exists)
  const leagueMatches = userLeague ? matches.filter(match => {
    const matchLeagueId = typeof match.leagueId === 'object' ? match.leagueId._id : match.leagueId;
    const currentLeagueId = userLeague._id;
    return matchLeagueId === currentLeagueId;
  }) : [];

  const fetchData = useCallback(async () => {
    console.log('=== USE EFFECT RUNNING ===');
    console.log('User:', user);

    try {
      // First fetch leagues to ensure we have the latest data
      console.log('Fetching leagues first...');
      await fetchLeagues();
      console.log('Leagues fetched successfully');

      // Now compute userLeague after leagues are fetched
      const currentUserLeague = leagues.find(league => {
        const leagueRef = user?.league;
        if (typeof leagueRef === 'string') {
          return league._id === leagueRef || league.id === leagueRef;
        } else {
          return league._id === leagueRef?._id;
        }
      });

      console.log('Computed userLeague after fetching leagues:', currentUserLeague);

      console.log('Fetching ALL matches (no leagueId filter)');
      await fetchMatches(); // Fetch all matches first
      console.log('All matches fetched successfully');

      // Also fetch teams if we have a user league
      if (currentUserLeague) {
        console.log('Fetching teams for league:', currentUserLeague._id);
        try {
          const teamsResponse = await fetch(`/api/teams?leagueId=${currentUserLeague._id}`);
          console.log('Teams response status:', teamsResponse.status);
          console.log('Teams response ok:', teamsResponse.ok);

          if (teamsResponse.ok) {
            const teamsData = await teamsResponse.json();
            setTeams(teamsData);
            console.log('Teams fetched successfully for league:', teamsData.length);
          } else {
            const errorText = await teamsResponse.text();
            console.error('Failed to fetch teams for league - Status:', teamsResponse.status);
            console.error('Error response:', errorText);
          }
        } catch (fetchError) {
          console.error('Network error fetching teams:', fetchError);
        }

        console.log('Fetching groups for league:', currentUserLeague._id);
        await fetchGroups(currentUserLeague._id);
        console.log('Groups fetched successfully');
      } else {
        console.log('No userLeague found, skipping teams and groups fetch');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setMatchesFetched(true);
    }
  }, [user, leagues, fetchMatches, fetchLeagues, setTeams, fetchGroups]);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      console.log('No user, skipping fetch');
    }
  }, [user, fetchData]);

  // Check if we need to show group creation UI
  const needsGroupCreation = userLeague?.type?.format === 'group_stage' && groups.length === 0;

  useEffect(() => {
    if (matchesFetched && !needsGroupCreation) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    } else if (matchesFetched && needsGroupCreation) {
      setIsLoading(false);
    }
  }, [matchesFetched, needsGroupCreation]);

  // Helper function to get team name (handles both ID strings and name strings)
  const getTeamName = (teamIdentifier: string, teams: any[]) => {
    if (!teamIdentifier) return 'Unknown Team';
    
    // First try to find by ID
    const teamById = teams.find(team => team._id === teamIdentifier);
    if (teamById) return teamById.name;
    
    // Then try to find by name
    const teamByName = teams.find(team => team.name === teamIdentifier);
    if (teamByName) return teamByName.name;
    
    // If not found, return the identifier as is (might be a name already)
    return teamIdentifier;
  };

  if (showGroupCreation) {
    return (
      <ProtectedRoute requiredRole="league-admin">
        <div className="min-h-screen bg-background text-foreground">
          <GradientBackground />

          <DashboardLayout
            title="League Admin"
            headerTitle="Group Setup"
            headerDescription={`Create groups for ${userLeague.name} group stage`}
            navItems={navItems}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Users size={40} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Set Up Groups
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Before creating matches, you need to organize your teams into groups. Select teams for each group and give them names.
                </p>
              </motion.div>

              {/* Group Creation Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Group Name</label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="e.g., Group A"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-4 text-white">Select Teams for this Group</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {teams.map((team) => (
                        <motion.div
                          key={team._id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (selectedTeams.includes(team._id)) {
                              setSelectedTeams(selectedTeams.filter(id => id !== team._id));
                            } else {
                              setSelectedTeams([...selectedTeams, team._id]);
                            }
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedTeams.includes(team._id)
                              ? 'border-purple-400/50 bg-purple-500/20 shadow-lg'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedTeams.includes(team._id)
                                ? 'border-purple-400 bg-purple-400'
                                : 'border-gray-400'
                            }`}>
                              {selectedTeams.includes(team._id) && (
                                <div className="w-full h-full rounded-full bg-purple-400 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              )}
                            </div>
                            <span className="text-white font-medium">{team.name}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      onClick={async () => {
                        if (!groupName.trim() || selectedTeams.length === 0) {
                          alert('Please enter a group name and select at least one team');
                          return;
                        }

                        setIsCreatingGroups(true);
                        try {
                          await createGroup({
                            name: groupName,
                            teams: selectedTeams,
                            leagueId: userLeague._id
                          });

                          setGroupName('');
                          setSelectedTeams([]);
                        } catch (error) {
                          console.error('Error creating group:', error);
                          alert('Failed to create group');
                        } finally {
                          setIsCreatingGroups(false);
                        }
                      }}
                      disabled={isCreatingGroups || !groupName.trim() || selectedTeams.length === 0}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingGroups ? 'Creating...' : 'Create Group'}
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        if (groups.length > 0) {
                          setShowGroupCreation(false);
                        } else {
                          alert('Please create at least one group first');
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20"
                    >
                      {groups.length > 0 ? 'Done' : 'Skip for Now'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Created Groups */}
              {groups.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold text-white">Created Groups</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.map((group, index) => (
                      <motion.div
                        key={group._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
                      >
                        <h3 className="text-lg font-bold text-white mb-3">{group.name}</h3>
                        <div className="space-y-2">
                          {group.teams.map((teamId) => {
                            const team = teams.find(t => t._id === teamId);
                            return (
                              <div key={teamId} className="text-gray-300 text-sm">
                                • {team?.name || 'Unknown Team'}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </DashboardLayout>
        </div>
      </ProtectedRoute>
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
            {/* Ultra Matches Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {[
                {
                  title: 'Upcoming Matches',
                  value: upcomingMatches.length.toString(),
                  icon: '📅',
                  trend: { value: 2, isPositive: true },
                  gradient: 'from-blue-500 to-cyan-500',
                  glow: 'shadow-blue-500/50'
                },
                {
                  title: 'Live Matches',
                  value: liveMatches.length.toString(),
                  icon: '🔴',
                  trend: { value: liveMatches.length > 0 ? 1 : 0, isPositive: liveMatches.length > 0 },
                  gradient: 'from-red-500 to-pink-500',
                  glow: 'shadow-red-500/50'
                },
                {
                  title: 'Completed Matches',
                  value: completedMatches.length.toString(),
                  icon: '✅',
                  trend: { value: 5, isPositive: true },
                  gradient: 'from-green-500 to-emerald-500',
                  glow: 'shadow-green-500/50'
                },
                {
                  title: 'Total Matches',
                  value: leagueMatches.length.toString(),
                  icon: '⚽',
                  trend: { value: 3, isPositive: true },
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

            {/* Ultra Live Matches */}
            {liveMatches.length > 0 && (
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
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg animate-pulse">🔴</span>
                    </div>
                    <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                      Live Matches
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Flame className="w-6 h-6 text-red-400" />
                    </motion.div>
                  </motion.h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {liveMatches.map((match, index) => (
                    <motion.div
                      key={match._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ x: 8, scale: 1.01 }}
                      className="glass-card p-6 rounded-3xl flex items-center justify-between hover:shadow-xl transition-all border border-white/10 backdrop-blur-xl group relative overflow-hidden"
                    >
                      {/* Live Pulse Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-red-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

                      {/* Animated Border */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-400/30 via-transparent to-red-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="font-bold text-lg text-white">
                            {getTeamName(match.homeTeam, teams)}
                          </span>
                          <motion.span
                            className="text-3xl font-bold text-white px-3 py-1 bg-red-500/20 rounded-xl border border-red-400/30"
                            whileHover={{ scale: 1.1 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {match.homeScore}
                          </motion.span>
                          <span className="text-white/60 font-bold text-xl">-</span>
                          <motion.span
                            className="text-3xl font-bold text-white px-3 py-1 bg-red-500/20 rounded-xl border border-red-400/30"
                            whileHover={{ scale: 1.1 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          >
                            {match.awayScore}
                          </motion.span>
                          <span className="font-bold text-lg text-white">
                            {getTeamName(match.awayTeam, teams)}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1"
                          >
                            <MapPin size={14} className="text-pink-400" />
                            <span>{match.venue || 'Venue TBD'}</span>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1"
                          >
                            <Clock size={14} className="text-red-400 animate-pulse" />
                            <span className="text-red-400 font-semibold">LIVE</span>
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 relative z-10">
                        <motion.span
                          className="px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Rocket className="w-4 h-4 inline mr-1" />
                          LIVE
                        </motion.span>

                        <motion.button
                          onClick={() => router.push(`/league-admin/matches/${match._id}/live`)}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 group/button"
                        >
                          <Eye size={18} className="text-gray-300 group-hover/button:text-white transition-colors" />
                        </motion.button>
                      </div>

                      {/* Live Sparkle Effects */}
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                        className="absolute top-4 left-4 w-3 h-3 bg-red-400 rounded-full shadow-lg"
                      />

                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.2, 0.6, 0.2]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.8
                        }}
                        className="absolute bottom-4 right-4 w-2 h-2 bg-pink-400 rounded-full shadow-lg"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Ultra Upcoming Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <motion.h3
                  className="text-xl font-bold flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Upcoming Matches ({upcomingMatches.length} matches)
                  </span>
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-5 h-5 text-blue-400" />
                  </motion.div>
                </motion.h3>
                <motion.button
                  onClick={() => router.push('/league-admin/matches')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-accent hover:text-accent/80 font-semibold text-sm flex items-center gap-2"
                >
                  View All
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {userLeague?.type?.format === 'group_stage' && upcomingMatches.some(m => m.group) ? (
                  // Group stage format - display by groups
                  Array.from(new Set(upcomingMatches.filter(m => m.group).map(m => m.group))).sort().map(groupName => {
                    const groupMatches = upcomingMatches.filter(m => m.group === groupName);
                    const groupColor = groupColors[groupName] || groupColors['Group 1'];

                    return (
                      <motion.div
                        key={groupName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        {/* Group Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-8 h-8 bg-gradient-to-r ${groupColor.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-bold text-sm">{groupName.split(' ')[1]}</span>
                          </div>
                          <h4 className={`text-lg font-bold bg-gradient-to-r ${groupColor.gradient} bg-clip-text text-transparent`}>
                            {groupName} Games ({groupMatches.length} matches)
                          </h4>
                        </div>

                        {/* Group Matches */}
                        {groupMatches.map((match, index) => (
                          <motion.div
                            key={match._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 6, scale: 1.01 }}
                            className={`glass-card p-6 rounded-3xl flex items-center justify-between hover:shadow-xl transition-all border ${groupColor.border} backdrop-blur-xl group relative overflow-hidden`}
                          >
                            {/* Group Color Background */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${groupColor.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                            <div className="flex-1 relative z-10">
                              <div className="flex items-center gap-4 mb-3">
                                <span className="font-bold text-lg text-white">
                                  {getTeamName(match.homeTeam, teams)}
                                </span>
                                <span className="text-white/60 font-bold text-xl">vs</span>
                                <span className="font-bold text-lg text-white">
                                  {getTeamName(match.awayTeam, teams)}
                                </span>
                              </div>

                              <div className="flex items-center gap-6 text-sm text-gray-400">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className="flex items-center gap-1"
                                >
                                  <Calendar size={14} className="text-pink-400" />
                                  <span>{new Date(match.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}</span>
                                </motion.div>

                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className="flex items-center gap-1"
                                >
                                  <Clock size={14} className="text-blue-400" />
                                  <span>{new Date(match.date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}</span>
                                </motion.div>

                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className="flex items-center gap-1"
                                >
                                  <MapPin size={14} className="text-green-400" />
                                  <span>{match.venue || 'Venue TBD'}</span>
                                </motion.div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                              <motion.span
                                className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r ${groupColor.gradient} text-white`}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Scheduled
                              </motion.span>

                              <motion.button
                                onClick={() => router.push(`/league-admin/matches/${match._id}/edit`)}
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 group/button"
                              >
                                <Edit2 size={18} className="text-gray-300 group-hover/button:text-white transition-colors" />
                              </motion.button>
                            </div>

                            {/* Group Sparkle Effects */}
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
                              className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${groupColor.gradient} rounded-full shadow-lg`}
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
                              className={`absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r ${groupColor.gradient} rounded-full shadow-lg`}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    );
                  })
                ) : (
                  // Regular format - display all matches normally
                  upcomingMatches.length > 0 ? upcomingMatches.map((match, index) => (
                    <motion.div
                      key={match._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 6, scale: 1.01 }}
                      className="glass-card p-6 rounded-3xl flex items-center justify-between hover:shadow-xl transition-all border border-white/10 backdrop-blur-xl group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="font-bold text-lg text-white">
                            {getTeamName(match.homeTeam, teams)}
                          </span>
                          <span className="text-white/60 font-bold text-xl">vs</span>
                          <span className="font-bold text-lg text-white">
                            {getTeamName(match.awayTeam, teams)}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1"
                          >
                            <Calendar size={14} className="text-pink-400" />
                            <span>{new Date(match.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1"
                          >
                            <Clock size={14} className="text-blue-400" />
                            <span>{new Date(match.date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1"
                          >
                            <MapPin size={14} className="text-green-400" />
                            <span>{match.venue || 'Venue TBD'}</span>
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <motion.span
                          className="px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Scheduled
                        </motion.span>

                        <motion.button
                          onClick={() => router.push(`/league-admin/matches/${match._id}/edit`)}
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 group/button"
                        >
                          <Edit2 size={18} className="text-gray-300 group-hover/button:text-white transition-colors" />
                        </motion.button>
                      </div>

                      {/* Upcoming Sparkle Effects */}
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
                        className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full shadow-lg"
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
                        className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-400 rounded-full shadow-lg"
                      />
                    </motion.div>
                  )) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-card p-8 rounded-3xl text-center border border-white/10 backdrop-blur-xl"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar size={32} className="text-blue-400/60" />
                      </div>
                      <h4 className="font-semibold mb-2 text-white">No Upcoming Matches</h4>
                      <p className="text-gray-400 mb-4">Schedule your first match to get started</p>
                      <motion.button
                        onClick={() => router.push('/league-admin/matches/create')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                      >
                        Schedule First Match
                      </motion.button>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>

            {/* Ultra Recent Results */}
            {completedMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <motion.h3
                    className="text-xl font-bold flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Trophy size={20} className="text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Recent Results
                    </span>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-5 h-5 text-yellow-400" />
                    </motion.div>
                  </motion.h3>
                  <motion.button
                    onClick={() => router.push('/league-admin/matches')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-accent hover:text-accent/80 font-semibold text-sm flex items-center gap-2"
                  >
                    View All
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {userLeague?.type?.format === 'group_stage' ? (
                    // Group stage format - display by groups
                    Array.from(new Set(completedMatches.filter(m => m.group).map(m => m.group))).sort().map(groupName => {
                      const groupMatches = completedMatches.filter(m => m.group === groupName).slice(0, 5);
                      const groupColor = groupColors[groupName] || groupColors['Group 1'];

                      return (
                        <motion.div
                          key={groupName}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          {/* Group Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-8 h-8 bg-gradient-to-r ${groupColor.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                              <span className="text-white font-bold text-sm">{groupName.split(' ')[1]}</span>
                            </div>
                            <h4 className={`text-lg font-bold bg-gradient-to-r ${groupColor.gradient} bg-clip-text text-transparent`}>
                              {groupName} Results ({groupMatches.length} matches)
                            </h4>
                          </div>

                          {/* Group Matches */}
                          {groupMatches.map((match, index) => (
                            <motion.div
                              key={match._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ x: 6, scale: 1.01 }}
                              className={`glass-card p-6 rounded-3xl flex items-center justify-between hover:shadow-xl transition-all border ${groupColor.border} backdrop-blur-xl group relative overflow-hidden`}
                            >
                              {/* Group Color Background */}
                              <div className={`absolute inset-0 bg-gradient-to-r ${groupColor.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                              <div className="flex-1 relative z-10">
                                <div className="flex items-center gap-4 mb-3">
                                  <span className="font-bold text-lg text-white">
                                    {getTeamName(match.homeTeam, teams)}
                                  </span>
                                  <motion.span
                                    className="text-3xl font-bold text-white px-3 py-1 bg-white/10 rounded-xl border border-white/20"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    {match.homeScore}
                                  </motion.span>
                                  <span className="text-white/60 font-bold text-xl">-</span>
                                  <motion.span
                                    className="text-3xl font-bold text-white px-3 py-1 bg-white/10 rounded-xl border border-white/20"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    {match.awayScore}
                                  </motion.span>
                                  <span className="font-bold text-lg text-white">
                                    {getTeamName(match.awayTeam, teams)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <Calendar size={16} className="text-pink-400" />
                                  <span>{new Date(match.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 relative z-10">
                                <motion.span
                                  className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r ${groupColor.gradient} text-white`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Trophy className="w-4 h-4 inline mr-1" />
                                  Completed
                                </motion.span>

                                <motion.button
                                  onClick={() => router.push(`/league-admin/matches/${match._id}`)}
                                  whileHover={{ scale: 1.2, rotate: 15 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 group/button"
                                >
                                  <Eye size={18} className="text-gray-300 group-hover/button:text-white transition-colors" />
                                </motion.button>
                              </div>

                              {/* Results Sparkle Effects */}
                              <motion.div
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [0.3, 0.8, 0.3]
                                }}
                                transition={{
                                  duration: 2.5,
                                  repeat: Infinity,
                                  delay: index * 0.4
                                }}
                                className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${groupColor.gradient} rounded-full shadow-lg`}
                              />

                              <motion.div
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.2, 0.6, 0.2]
                                }}
                                transition={{
                                  duration: 3.5,
                                  repeat: Infinity,
                                  delay: index * 0.9
                                }}
                                className={`absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r ${groupColor.gradient} rounded-full shadow-lg`}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      );
                    })
                  ) : (
                    // Regular format - display all matches normally
                    completedMatches.slice(0, 5).map((match, index) => (
                      <motion.div
                        key={match._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ x: 6, scale: 1.01 }}
                        className="glass-card p-6 rounded-3xl flex items-center justify-between hover:shadow-xl transition-all border border-white/10 backdrop-blur-xl group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <span className="font-bold text-lg text-white">
                              {getTeamName(match.homeTeam, teams)}
                            </span>
                            <motion.span
                              className="text-3xl font-bold text-white px-3 py-1 bg-white/10 rounded-xl border border-white/20"
                              whileHover={{ scale: 1.1 }}
                            >
                              {match.homeScore}
                            </motion.span>
                            <span className="text-white/60 font-bold text-xl">-</span>
                            <motion.span
                              className="text-3xl font-bold text-white px-3 py-1 bg-white/10 rounded-xl border border-white/20"
                              whileHover={{ scale: 1.1 }}
                            >
                              {match.awayScore}
                            </motion.span>
                            <span className="font-bold text-lg text-white">
                              {getTeamName(match.awayTeam, teams)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar size={16} className="text-pink-400" />
                            <span>{new Date(match.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <motion.span
                            className="px-4 py-2 rounded-xl text-sm font-bold shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Trophy className="w-4 h-4 inline mr-1" />
                            Completed
                          </motion.span>

                          <motion.button
                            onClick={() => router.push(`/league-admin/matches/${match._id}`)}
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 group/button"
                          >
                            <Eye size={18} className="text-gray-300 group-hover/button:text-white transition-colors" />
                          </motion.button>
                        </div>

                        {/* Results Sparkle Effects */}
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.8, 0.3]
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: index * 0.4
                          }}
                          className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full shadow-lg"
                        />

                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.2, 0.6, 0.2]
                          }}
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            delay: index * 0.9
                          }}
                          className="absolute bottom-4 left-4 w-2 h-2 bg-emerald-400 rounded-full shadow-lg"
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
