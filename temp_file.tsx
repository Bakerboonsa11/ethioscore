'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Plus,
  Zap,
  Target,
  Shuffle,
  TrophyIcon,
  Trophy,
  PlayCircle,
  Save,
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  Sparkles,
  X,
  ChevronDown,
  User,
  Users,
  AlertTriangle
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/league-admin', icon: <Calendar size={20} /> },
  { label: 'Teams', href: '/league-admin/teams', icon: <Calendar size={20} /> },
  { label: 'Matches', href: '/league-admin/matches', icon: <Calendar size={20} /> },
  { label: 'Referees', href: '/league-admin/referees', icon: <Calendar size={20} /> },
];

export default function CreateMatchPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'manual' | 'automatic'>('manual');
  const [generatedFixtures, setGeneratedFixtures] = useState<any[]>([]);
  const [fixtureSettings, setFixtureSettings] = useState({
    startDate: '',
    startTime: '',
    defaultVenue: '',
    matchesPerWeek: 1,
    includeReferees: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [savingProgress, setSavingProgress] = useState<{ current: number; total: number; message: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGroupCreationInline, setShowGroupCreationInline] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isCreatingGroups, setIsCreatingGroups] = useState(false);
  const [selectedGroupForMatch, setSelectedGroupForMatch] = useState<any>(null);
  const [groupMatch, setGroupMatch] = useState({ homeTeam: '', awayTeam: '', date: '', time: '', venue: '' });
  const [showHomeTeamDropdown, setShowHomeTeamDropdown] = useState(false);
  const [showAwayTeamDropdown, setShowAwayTeamDropdown] = useState(false);

  // Manual match form state
  const [manualMatch, setManualMatch] = useState({
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: '',
    venue: '',
    referee: '',
    assistantReferee1: '',
    assistantReferee2: '',
    eventAdmin: '',
    notes: '',
    showHomeDropdown: false,
    showAwayDropdown: false,
    showRefereeDropdown: false,
    showAssistantReferee1Dropdown: false,
    showAssistantReferee2Dropdown: false,
    showEventAdminDropdown: false,
    selectedHomeGroup: '',
    selectedAwayGroup: ''
  });

  const { user, leagues, teams, users, fetchTeams, fetchUsers, groups, fetchGroups, createGroup } = useAppStore();

  // Get the league that this admin manages
  const userLeague = leagues.find(league => {
    if (typeof user?.league === 'object' && user.league !== null) {
      return league._id === user.league._id;
    } else if (typeof user?.league === 'string') {
      return league._id === user.league || league.id === user.league;
    }
    return false;
  });

  // Filter teams for this league
  const leagueTeams = teams.filter(team =>
    (typeof team.league === 'object' && team.league?._id === userLeague?._id) ||
    (typeof team.league === 'string' && team.league === userLeague?._id)
  );

  // Filter referees for this league
  const leagueReferees = users.filter(user =>
    user.role === 'referee' &&
    ((typeof user.league === 'object' && user.league?._id === userLeague?._id) ||
     (typeof user.league === 'string' && user.league === userLeague?._id))
  );

  useEffect(() => {
    if (userLeague?.type?.format === 'group_stage' && activeTab === 'automatic') {
      setActiveTab('manual');
    }
  }, [userLeague?.type?.format, activeTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setManualMatch(prev => ({
          ...prev,
          showHomeDropdown: false,
          showAwayDropdown: false,
          showRefereeDropdown: false,
          showAssistantReferee1Dropdown: false,
          showAssistantReferee2Dropdown: false,
          showEventAdminDropdown: false
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (userLeague) {
        setIsLoadingTeams(true);
        await fetchTeams(userLeague._id);
        await fetchUsers();
        await fetchGroups(userLeague._id);
        setIsLoadingTeams(false);
      }
    };

    if (user && userLeague) {
      loadData();
    }
  }, [user, userLeague, fetchTeams, fetchUsers, fetchGroups]);

  const handleFixtureSettingsChange = (field: string, value: any) => {
    setFixtureSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleManualMatchChange = (field: string, value: string) => {
    setManualMatch(prev => ({ ...prev, [field]: value }));
  };

  // Define Fixture type
  type Fixture = {
    homeTeam: string;
    awayTeam: string;
    round: number;
    type: 'league' | 'knockout' | 'group_stage' | 'group_stage_knockout';
    roundName?: string;
    group?: string;
  };

  // 🎯 Round-Robin Algorithm for League Format
  const generateLeagueFixtures = (teams: any[], hasHomeAway: boolean) => {
    const fixtures: Fixture[] = [];
    let workingTeams = [...teams];

    // For odd number of teams, add a dummy team
    if (workingTeams.length % 2 === 1) {
      workingTeams.push({ name: 'DUMMY', _id: 'dummy' });
    }

    const numTeams = workingTeams.length;

    for (let round = 0; round < numTeams - 1; round++) {
      const roundFixtures: Fixture[] = [];

      // Pair teams for this round
      for (let i = 0; i < numTeams / 2; i++) {
        const home = workingTeams[i];
        const away = workingTeams[numTeams - 1 - i];

        // Skip fixtures involving dummy team
        if (home.name === 'DUMMY' || away.name === 'DUMMY') continue;

        roundFixtures.push({
          homeTeam: home.name,
          awayTeam: away.name,
          round: round + 1,
          type: 'league'
        });

        // Add reverse fixture for home-away leagues
        if (hasHomeAway) {
          roundFixtures.push({
            homeTeam: away.name,
            awayTeam: home.name,
            round: round + numTeams,
            type: 'league'
          });
        }
      }

      fixtures.push(...roundFixtures);

      // Rotate teams (keep first team fixed)
      const temp = workingTeams[workingTeams.length - 1];
      for (let i = workingTeams.length - 1; i > 1; i--) {
        workingTeams[i] = workingTeams[i - 1];
      }
      workingTeams[1] = temp;
    }

    return fixtures;
  };

  // 🏆 FIFA Knockout Bracket Generation
  const generateKnockoutFixtures = (teams: any[], rounds: number) => {
    const fixtures: Fixture[] = [];
    const numTeams = teams.length;

    // Sort teams by some ranking criteria (for now, just random seeding simulation)
    const seededTeams = [...teams].sort((a, b) => Math.random() - 0.5);

    let currentRoundTeams = seededTeams;
    let roundNumber = 1;

    while (currentRoundTeams.length > 1 && roundNumber <= rounds) {
      const nextRoundTeams = [];
      const roundFixtures: Fixture[] = [];

      for (let i = 0; i < currentRoundTeams.length; i += 2) {
        if (i + 1 < currentRoundTeams.length) {
          const home = currentRoundTeams[i];
          const away = currentRoundTeams[i + 1];

          roundFixtures.push({
            homeTeam: home.name,
            awayTeam: away.name,
            round: roundNumber,
            roundName: getRoundName(roundNumber, numTeams),
            type: 'knockout'
          });
        } else {
          // Handle odd number of teams (bye)
          nextRoundTeams.push(currentRoundTeams[i]);
        }
      }

      fixtures.push(...roundFixtures);
      currentRoundTeams = nextRoundTeams;
      roundNumber++;
    }

    return fixtures;
  };

  const getRoundName = (round: number, totalTeams: number) => {
    const rounds = Math.log2(totalTeams);
    if (round === rounds) return 'Final';
    if (round === rounds - 1) return 'Semi-Final';
    if (round === rounds - 2) return 'Quarter-Final';
    if (round === rounds - 3) return 'Round of 16';
    if (round === rounds - 4) return 'Round of 32';
    return `Round ${round}`;
  };

  // 🎯 Group Stage Generation with Knockout Progression
  const generateGroupStageFixtures = (teams: any[], groupCount: number, hasHomeAway: boolean) => {
    const fixtures: Fixture[] = [];

    // Distribute teams into groups based on total team count
    // Groups should be as equal as possible, minimum group size based on total teams
    const groups: any[][] = [];
    let teamIndex = 0;

    // Determine number of groups and group sizes based on total teams
    let actualGroupCount = 1; // Default to 1 group
    let groupSizes: number[] = [];

    if (teams.length <= 5) {
      // For 4-5 teams: 1 group
      actualGroupCount = 1;
      groupSizes = [teams.length];
    } else if (teams.length === 6) {
      // For 6 teams: 2 groups of 3
      actualGroupCount = 2;
      groupSizes = [3, 3];
    } else if (teams.length === 7) {
      // For 7 teams: 2 groups (3 and 4)
      actualGroupCount = 2;
      groupSizes = [3, 4];
    } else if (teams.length === 8) {
      // For 8 teams: 2 groups of 4
      actualGroupCount = 2;
      groupSizes = [4, 4];
    } else {
      // For more than 8 teams, distribute evenly into reasonable groups
      // Aim for 3-5 groups, with groups of 3-6 teams each
      if (teams.length <= 12) {
        actualGroupCount = 3;
      } else if (teams.length <= 18) {
        actualGroupCount = 4;
      } else {
        actualGroupCount = 5;
      }

      // Distribute teams as evenly as possible
      const baseSize = Math.floor(teams.length / actualGroupCount);
      const remainder = teams.length % actualGroupCount;

      groupSizes = [];
      for (let g = 0; g < actualGroupCount; g++) {
        groupSizes.push(baseSize + (g < remainder ? 1 : 0));
      }
    }

    // Create groups with calculated sizes
    for (let g = 0; g < actualGroupCount; g++) {
      groups[g] = [];
      for (let i = 0; i < groupSizes[g]; i++) {
        groups[g].push(teams[teamIndex++]);
      }
    }

    // Generate fixtures within each group (round-robin)
    groups.forEach((group, groupIndex) => {
      if (group.length < 2) return;

      const groupFixtures = generateLeagueFixtures(group, hasHomeAway);
      groupFixtures.forEach(fixture => {
        fixtures.push({
          ...fixture,
          roundName: `Group ${groupIndex + 1} (${groupSizes[groupIndex]} teams) - ${fixture.roundName || `Round ${fixture.round}`}`,
          group: `Group ${groupIndex + 1}`
        });
      });
    });

    // After group stage, add knockout rounds
    // For simplicity, we'll assume top 2 from each group advance
    // In a real implementation, this would be based on group standings
    const advancingTeams: any[] = [];
    groups.forEach((group, groupIndex) => {
      // For now, take first 2 teams from each group (in real implementation, this would be based on points/goals)
      // In a production system, you'd need to calculate standings after group stage completion
      if (group.length >= 2) {
        // Take top 2 teams from each group for knockout
        advancingTeams.push(group[0], group[1]);
      } else if (group.length === 1) {
        // If only 1 team in group, they still advance
        advancingTeams.push(group[0]);
      }
    });

    console.log(`Group stage complete. Created ${groups.length} groups with sizes: ${groupSizes.join(', ')}`);
    console.log(`Advancing teams to knockout: ${advancingTeams.length} teams`);

    // Generate knockout fixtures with advancing teams
    if (advancingTeams.length >= 2) {
      const knockoutFixtures = generateKnockoutFixtures(advancingTeams, Math.ceil(Math.log2(advancingTeams.length)));
      knockoutFixtures.forEach(fixture => {
        fixtures.push({
          ...fixture,
          roundName: `Knockout - ${fixture.roundName}`,
          type: 'group_stage_knockout' // Special type to distinguish from group stage
        });
      });
    }

    return fixtures;
  };

  // Handle manual match submission
  const handleManualMatchSubmit = async () => {
    if (!manualMatch.homeTeam || !manualMatch.awayTeam || !manualMatch.date || !manualMatch.time || !manualMatch.venue) {
      alert('Please fill in all required fields');
      return;
    }

    if (!userLeague || !userLeague._id) {
      alert('League information is missing');
      return;
    }

    setIsLoading(true);

    try {
      // Find team names from IDs
      const homeTeamObj = leagueTeams.find(team => team._id === manualMatch.homeTeam);
      const awayTeamObj = leagueTeams.find(team => team._id === manualMatch.awayTeam);

      if (!homeTeamObj || !awayTeamObj) {
        alert('Selected teams not found');
        setIsLoading(false);
        return;
      }

      // Prepare match data with team names
      const matchData: any = {
        homeTeam: homeTeamObj.name,
        awayTeam: awayTeamObj.name,
        homeScore: 0,
        awayScore: 0,
        date: manualMatch.date,
        time: manualMatch.time,
        venue: manualMatch.venue,
        leagueId: userLeague._id,
        status: 'scheduled'
      };

      // Add group information for group stage matches
      if (userLeague?.type?.format === 'group_stage') {
        // Find which group the home team belongs to
        const homeTeamGroup = groups.find(group => group.teams.includes(manualMatch.homeTeam));
        if (homeTeamGroup) {
          matchData.group = homeTeamGroup.name;
        }
      }

      console.log('Submitting manual match:', matchData);

      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        alert(`Failed to create match: ${errorData.error || response.statusText}`);
      } else {
        const savedMatch = await response.json();
        console.log('Match created successfully:', savedMatch);
        alert('Match created successfully!');
        
        // Reset form
        setManualMatch({
          homeTeam: '',
          awayTeam: '',
          date: '',
          time: '',
          venue: '',
          referee: '',
          assistantReferee1: '',
          assistantReferee2: '',
          eventAdmin: '',
          notes: '',
          showHomeDropdown: false,
          showAwayDropdown: false,
          showRefereeDropdown: false,
          showAssistantReferee1Dropdown: false,
          showAssistantReferee2Dropdown: false,
          showEventAdminDropdown: false,
          selectedHomeGroup: '',
          selectedAwayGroup: ''
        });

        // Redirect to matches page
        router.push('/league-admin/matches');
      }
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Failed to create match. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🎯 Generate Fixtures Based on League Type
  const generateFixtures = () => {
    console.log('Generate fixtures called');
    console.log('User league:', userLeague);
    console.log('League teams:', leagueTeams.length);
    console.log('Fixture settings:', fixtureSettings);

    if (!userLeague || leagueTeams.length < 2) {
      console.log('Missing userLeague or not enough teams');
      return;
    }

    if (!fixtureSettings.startDate || !fixtureSettings.startTime || !fixtureSettings.defaultVenue) {
      console.log('Missing required fixture settings');
      alert('Please fill in all required fields: Start Date, Start Time, and Default Venue');
      return;
    }

    console.log('Generating fixtures for format:', userLeague.type?.format);

    let fixtures: Fixture[] = [];

    if (userLeague.type?.format === 'league') {
      fixtures = generateLeagueFixtures([...leagueTeams], userLeague.type.hasHomeAway);
      console.log('League fixtures generated:', fixtures.length, 'fixtures');
      fixtures.forEach((f, i) => console.log(`Fixture ${i+1}: ${f.homeTeam} vs ${f.awayTeam} (Round ${f.round})`));
    } else if (userLeague.type?.format === 'knockout') {
      fixtures = generateKnockoutFixtures([...leagueTeams], userLeague.type.knockoutRounds || 3);
    } else if (userLeague.type?.format === 'group_stage') {
      fixtures = generateGroupStageFixtures([...leagueTeams], userLeague.type.groupCount || 4, userLeague.type.hasHomeAway);
    }

    console.log('Generated fixtures:', fixtures.length);

    // Add dates and venues to fixtures
    const scheduledFixtures = fixtures.map((fixture, index) => {
      const matchDate = new Date(fixtureSettings.startDate);
      matchDate.setDate(matchDate.getDate() + Math.floor(index / fixtureSettings.matchesPerWeek) * 7);

      return {
        ...fixture,
        date: matchDate.toISOString().split('T')[0],
        time: fixtureSettings.startTime,
        venue: fixtureSettings.defaultVenue,
        homeScore: 0,
        awayScore: 0,
        status: 'scheduled'
      };
    });

    console.log('Scheduled fixtures:', scheduledFixtures.length);
    setGeneratedFixtures(scheduledFixtures);
  };

  const saveGeneratedFixtures = async () => {
    console.log('saveGeneratedFixtures called with', generatedFixtures.length, 'fixtures');

    if (generatedFixtures.length === 0) {
      console.log('No fixtures to save');
      alert('No fixtures to save. Please generate fixtures first.');
      return;
    }

    if (!userLeague || !userLeague._id) {
      console.log('Missing userLeague or league ID');
      alert('Unable to save: League information is missing.');
      return;
    }

    const leagueId = userLeague._id;
    console.log('Saving to league ID:', leagueId);

    setSavingProgress({ current: 0, total: generatedFixtures.length, message: 'Preparing to save fixtures...' });
    setIsLoading(true);

    try {
      // Get available referees and event admins for this league
      const availableReferees = fixtureSettings.includeReferees
        ? users.filter(user => user.role === 'referee' && user.leagues?.includes(leagueId))
        : [];
      const availableEventAdmins = fixtureSettings.includeReferees
        ? users.filter(user => user.role === 'event-admin' && user.leagues?.includes(leagueId))
        : [];

      console.log('Available referees:', availableReferees.length);
      console.log('Available event admins:', availableEventAdmins.length);
      console.log('All teams:', teams.length, teams.map(t => ({ name: t.name, _id: t._id })));
      console.log('League teams:', leagueTeams.length, leagueTeams.map(t => t.name));

      let savedCount = 0;
      let errors = [];

      for (const fixture of generatedFixtures) {
        try {
          setSavingProgress({
            current: savedCount,
            total: generatedFixtures.length,
            message: `Saving match ${savedCount + 1} of ${generatedFixtures.length}: ${fixture.homeTeam} vs ${fixture.awayTeam}`
          });

          // Find home and away team objects
          const homeTeam = teams.find(t => t.name === fixture.homeTeam);
          const awayTeam = teams.find(t => t.name === fixture.awayTeam);

          if (!homeTeam || !awayTeam) {
            console.error('Team not found:', fixture.homeTeam, fixture.awayTeam);
            errors.push(`Teams not found for ${fixture.homeTeam} vs ${fixture.awayTeam}`);
            continue;
          }

          // Prepare match data with team names (not IDs)
          let matchData: any = {
            homeTeam: homeTeam.name, // Use team name, not ID
            awayTeam: awayTeam.name, // Use team name, not ID
            homeScore: fixture.homeScore || 0,
            awayScore: fixture.awayScore || 0,
            date: fixture.date,
            time: fixture.time,
            venue: fixture.venue,
            leagueId: leagueId,
            status: fixture.status || 'scheduled',
            group: fixture.group, // Include group information
            roundName: fixture.roundName // Include round name
          };

          // Assign officials if requested
          if (fixtureSettings.includeReferees) {
            if (availableReferees.length >= 3) {
              // Shuffle referees to randomize assignment
              const shuffledReferees = [...availableReferees].sort(() => Math.random() - 0.5);
              matchData.referee = shuffledReferees[0]._id;
              matchData.assistantReferee1 = shuffledReferees[1]._id;
              matchData.assistantReferee2 = shuffledReferees[2]._id;
            }

            if (availableEventAdmins.length > 0) {
              const randomEventAdmin = availableEventAdmins[Math.floor(Math.random() * availableEventAdmins.length)];
              matchData.eventAdmin = randomEventAdmin._id;
            }
          }

          console.log('Sending match data:', matchData);

          const response = await fetch('/api/matches', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(matchData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('API error:', errorData);
            errors.push(`Failed to save ${fixture.homeTeam} vs ${fixture.awayTeam}: ${errorData.error || response.statusText}`);
            continue;
          }

          const savedMatch = await response.json();
          console.log('Match saved successfully:', savedMatch);

          savedCount++;

        } catch (error) {
          console.error('Error saving fixture:', error);
          errors.push(`Error saving ${fixture.homeTeam} vs ${fixture.awayTeam}: ${error.message}`);
        }
      }

      setSavingProgress({
        current: savedCount,
        total: generatedFixtures.length,
        message: `Completed! ${savedCount} matches saved successfully.`
      });

      console.log('Save completed. Saved:', savedCount, 'Errors:', errors.length);

      if (errors.length > 0) {
        alert(`Saved ${savedCount} matches, but ${errors.length} failed:\n${errors.slice(0, 3).join('\n')}`);
      } else {
        alert(`All ${savedCount} matches saved successfully!`);
      }

      // Show success modal after a delay
      setTimeout(() => {
        setShowSuccess(true);
        setSavingProgress(null);
        setIsLoading(false);
        router.push('/league-admin/matches');
      }, 2000);

    } catch (error) {
      console.error('Save process failed:', error);
      alert('Failed to save fixtures. Check console for details.');
      setSavingProgress(null);
      setIsLoading(false);
    }
  };

  if (!userLeague) {
    return (
      <ProtectedRoute requiredRole="league-admin">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading league data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Check if groups need to be created first for group_stage leagues
  if (userLeague?.type?.format === 'group_stage' && groups.length === 0) {
    return (
      <ProtectedRoute requiredRole="league-admin">
        <div className="min-h-screen bg-background text-foreground">
          <GradientBackground />

          <DashboardLayout
            title="Create Match"
            headerTitle="Groups Required"
            headerDescription="You need to create groups before scheduling matches"
            navItems={navItems}
            headerActions={
              <motion.button
                onClick={() => setShowGroupCreationInline(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all border border-white/20"
              >
                <Users size={20} />
                Create Groups Now
              </motion.button>
            }
          >
            {!showGroupCreationInline ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto text-center space-y-8"
              >
                {/* League Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      userLeague?.type?.format === 'league'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        : userLeague?.type?.format === 'knockout'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    } shadow-lg`}>
                      {userLeague?.type?.format === 'league' ? (
                        <Shuffle size={24} className="text-white" />
                      ) : userLeague?.type?.format === 'knockout' ? (
                        <TrophyIcon size={24} className="text-white" />
                      ) : (
                        <Users size={24} className="text-white" />
                      )}
                    </div>

                    <div className="text-left">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {userLeague?.name}
                      </h3>
                      <div className="flex flex-col gap-1 mt-2">
                        <p className="text-sm font-medium text-blue-300">
                          Format: <span className="text-white capitalize">{userLeague?.type?.format?.replace('_', ' ')}</span>
                        </p>
                        <p className="text-sm font-medium text-green-300">
                          Teams: <span className="text-white">{leagueTeams.length} teams available</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Users size={48} className="text-white" />
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Groups Required First
                  </h1>
                  <p className="text-gray-300 text-lg max-w-lg mx-auto">
                    For group stage leagues, you need to organize your teams into groups before creating matches.
                    Click the button above to set up your groups from the available teams.
                  </p>
                </div>

                <motion.button
                  onClick={() => setShowGroupCreationInline(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Users size={24} />
                  Create Groups Now
                </motion.button>
              </motion.div>
            ) : (
              // Inline Group Creation UI
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
                    Organize your {leagueTeams.length} available teams into groups. Select teams for each group and give them names.
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
                      <label className="block text-sm font-medium mb-4 text-white">Select Teams for this Group ({leagueTeams.length} teams available)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                        {leagueTeams.map((team) => (
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
                        onClick={() => setShowGroupCreationInline(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20"
                      >
                        Cancel
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
                              const team = leagueTeams.find(t => t._id === teamId);
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

                    {groups.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <motion.button
                          onClick={() => router.refresh()}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                          <Plus size={24} />
                          Now Create Matches
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            <ProtectedRoute requiredRole="league-admin">
              <div className="min-h-screen bg-background text-foreground">
                <GradientBackground />

                <DashboardLayout
                  title="Create Match"
                  headerTitle="Schedule New Match"
                  headerDescription="Create and schedule a new match for your league"
                  navItems={navItems}
                  headerActions={
                    <motion.button
                      onClick={() => router.push('/league-admin/matches')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all border border-white/20"
                    >
                      Back to Matches
                    </motion.button>
                  }
                >
                  <div className="max-w-4xl mx-auto space-y-8">
                    {/* Loading content */}
                  </div>
                </DashboardLayout>
              </div>
            </ProtectedRoute>
          title="Create Match"
          headerTitle="Schedule New Match"
          headerDescription="Create and schedule a new match for your league"
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={() => router.push('/league-admin/matches')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all border border-white/20"
            >
              Back to Matches
            </motion.button>
          }
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Loading content */}
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
