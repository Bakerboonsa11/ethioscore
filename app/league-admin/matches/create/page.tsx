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
  const [showMatchCreation, setShowMatchCreation] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [showGroupCreationInline, setShowGroupCreationInline] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isCreatingGroups, setIsCreatingGroups] = useState(false);
  const [showGroupCreation, setShowGroupCreation] = useState(false);
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

  const { user, leagues, matches, fetchMatches, fetchLeagues, teams, fetchTeams, users, fetchUsers, groups, fetchGroups, createGroup } = useAppStore();

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
      try {
        // Fetch teams for the league using the store function
        if (userLeague?._id) {
          await fetchTeams(userLeague._id);
          console.log('Teams loaded for create match page via store');
        }

        // Fetch groups for the league
        if (userLeague?._id) {
          await fetchGroups(userLeague._id);
          console.log('Groups loaded for create match page');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data for create match page:', error);
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [user, userLeague, fetchTeams, fetchGroups]);

  const handleFixtureSettingsChange = (field: string, value: any) => {
    setFixtureSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleManualMatchChange = (field: string, value: string) => {
    setManualMatch(prev => ({ ...prev, [field]: value }));
  };

  // Helper function to get selected team name from team ID
  const getSelectedTeamName = (teamId: string) => {
    if (!teamId) return '';
    const team = leagueTeams.find(t => t._id === teamId);
    return team ? team.name : '';
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
    console.log('handleManualMatchSubmit called');
    console.log('manualMatch:', manualMatch);
    console.log('userLeague:', userLeague);
    console.log('leagueTeams:', leagueTeams);

    if (!manualMatch.homeTeam || !manualMatch.awayTeam || !manualMatch.date || !manualMatch.time || !manualMatch.venue) {
      console.log('Missing required fields');
      alert('Please fill in all required fields');
      return;
    }

    // Prevent selecting the same team for home and away
    if (manualMatch.homeTeam === manualMatch.awayTeam) {
      alert('Home team and away team cannot be the same');
      return;
    }

    if (!userLeague || !userLeague._id) {
      console.log('Missing userLeague or league ID');
      alert('League information is missing');
      return;
    }

    // Check if selected teams are in the same group (for group stage)
    if (userLeague?.type?.format === 'group_stage' && selectedGroup) {
      const selectedGroupData = groups.find(g => g._id === selectedGroup);
      if (selectedGroupData) {
        const homeTeamInGroup = selectedGroupData.teams.includes(manualMatch.homeTeam);
        const awayTeamInGroup = selectedGroupData.teams.includes(manualMatch.awayTeam);

        if (!homeTeamInGroup || !awayTeamInGroup) {
          alert('Both teams must be from the selected group');
          return;
        }
      }
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
        alert('Single match created successfully!');
        
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

  return (
      <ProtectedRoute requiredRole="league-admin">
        {(!userLeague) ? (
          <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading league data...</p>
            </div>
          </div>
        ) : showGroupCreationInline ? (
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
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                      <Users size={24} className="text-white" />
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

                          // Validate that none of the selected teams are already in other groups
                          const conflictingTeams = selectedTeams.filter(teamId =>
                            groups.some(group => group.teams.includes(teamId))
                          );

                          if (conflictingTeams.length > 0) {
                            const conflictingTeamNames = conflictingTeams.map(teamId =>
                              leagueTeams.find(t => t._id === teamId)?.name
                            ).join(', ');
                            alert(`Cannot create group: The following teams are already assigned to other groups: ${conflictingTeamNames}`);
                            return;
                          }

                          setIsCreatingGroups(true);
                          try {
                            await createGroup({
                              name: groupName,
                              teams: selectedTeams,
                              leagueId: userLeague._id
                            });
                            await fetchGroups(userLeague._id);
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
                        onClick={() => setShowGroupCreation(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20"
                      >
                        ← Back to Match Creation
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
        ) : (
          <div className="min-h-screen bg-background text-foreground">
            <GradientBackground />

            <DashboardLayout
              title="Create Match"
              headerTitle="Create New Match"
              headerDescription="Schedule matches manually or generate fixtures automatically"
              navItems={navItems}
              headerActions={null}
            >
              <div className="space-y-8">
                {/* For Group Stage Leagues with Groups - Show Group-Based Interface */}
                {userLeague?.type?.format === 'group_stage' && groups.length > 0 ? (
              <>
                {/* Group-Based Match Creation Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-4 sm:space-y-6"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Calendar size={32} className="text-white sm:w-10 sm:h-10" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Create Group Matches
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-4">
                      Select a group and create matches between teams within that group. Teams must be in the same group to play against each other.
                    </p>
                  </div>
                </motion.div>

                {/* Group Selection */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-white">Select Group</h2>
                  <p className="text-gray-400 text-sm sm:text-base">Choose a group to create matches between its teams</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                    {groups.map((group, index) => {
                      const groupTeams = group.teams.map(teamId =>
                        leagueTeams.find(t => t._id === teamId)
                      ).filter(Boolean);

                      return (
                        <motion.div
                          key={group._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setSelectedGroup(group._id)}
                          className={`glass-card p-4 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                            selectedGroup === group._id
                              ? 'border-green-400/50 bg-green-500/10 shadow-lg ring-2 ring-green-400/20'
                              : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              selectedGroup === group._id
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            } shadow-lg`}>
                              <Users size={24} className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{group.name}</h3>
                              <p className="text-gray-400 text-sm">{groupTeams.length} teams</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {groupTeams.slice(0, 3).map((team) => (
                              <div key={team._id} className="text-gray-300 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                {team.name}
                              </div>
                            ))}
                            {groupTeams.length > 3 && (
                              <p className="text-gray-400 text-sm">+{groupTeams.length - 3} more teams</p>
                            )}
                          </div>

                          {selectedGroup === group._id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-4 flex items-center gap-2 text-green-400"
                            >
                              <CheckCircle size={20} />
                              <span className="text-sm font-medium">Selected</span>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Match Creation Form */}
                {selectedGroup && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-4 sm:p-6 lg:p-8 rounded-2xl border border-white/10 backdrop-blur-xl"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white">Create Match</h2>

                    <div className="space-y-6">
                      {/* Single Match Creation Info */}
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Plus size={16} className="text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-white">Create Single Match</h3>
                        </div>
                        <p className="text-green-200 text-sm">
                          Schedule an individual match between two teams from the selected group. Only teams within the same group can play against each other.
                        </p>
                      </div>

                      {/* Team Selection Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Home Team */}
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-white">
                            Home Team
                            {selectedGroup && (
                              <span className="text-green-400 text-xs ml-2">
                                ({(() => {
                                  const selectedGroupData = groups.find(g => g._id === selectedGroup);
                                  return selectedGroupData?.teams.length || 0;
                                })()} teams available)
                              </span>
                            )}
                          </label>
                          <div className="relative">
                            <button
                              onClick={() => setManualMatch(prev => ({ ...prev, showHomeDropdown: !prev.showHomeDropdown }))}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 flex items-center justify-between hover:bg-white/10 transition-colors"
                            >
                              <span className="truncate">{manualMatch.homeTeam ? getSelectedTeamName(manualMatch.homeTeam) || 'Select Home Team' : 'Select Home Team'}</span>
                              <ChevronDown size={20} />
                            </button>
                            {manualMatch.showHomeDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {(() => {
                                  const selectedGroupData = groups.find(g => g._id === selectedGroup);
                                  const groupTeamIds = selectedGroupData?.teams || [];
                                  const availableTeams = leagueTeams.filter(team =>
                                    team._id && groupTeamIds.includes(team._id)
                                  );

                                  return availableTeams.map((team) => (
                                    <button
                                      key={team._id}
                                      onClick={() => {
                                        if (team._id) {
                                          handleManualMatchChange('homeTeam', team._id);
                                          setManualMatch(prev => ({ ...prev, showHomeDropdown: false }));
                                        }
                                      }}
                                      className="w-full px-4 py-2 text-left text-white hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl transition-colors"
                                    >
                                      {team.name}
                                    </button>
                                  ));
                                })()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Away Team */}
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-white">
                            Away Team
                            {selectedGroup && (
                              <span className="text-green-400 text-xs ml-2">
                                ({(() => {
                                  const selectedGroupData = groups.find(g => g._id === selectedGroup);
                                  const groupTeamIds = selectedGroupData?.teams || [];
                                  const availableTeams = leagueTeams.filter(team =>
                                    team._id && groupTeamIds.includes(team._id)
                                  );
                                  return selectedGroupData?.teams.length || 0;
                                })()} teams available)
                              </span>
                            )}
                          </label>
                          <div className="relative">
                            <button
                              onClick={() => setManualMatch(prev => ({ ...prev, showAwayDropdown: !prev.showAwayDropdown }))}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 flex items-center justify-between hover:bg-white/10 transition-colors"
                            >
                              <span className="truncate">{manualMatch.awayTeam ? getSelectedTeamName(manualMatch.awayTeam) || 'Select Away Team' : 'Select Away Team'}</span>
                              <ChevronDown size={20} />
                            </button>
                            {manualMatch.showAwayDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {(() => {
                                  const selectedGroupData = groups.find(g => g._id === selectedGroup);
                                  const groupTeamIds = selectedGroupData?.teams || [];
                                  const availableTeams = leagueTeams.filter(team =>
                                    team._id && groupTeamIds.includes(team._id)
                                  );

                                  return availableTeams.map((team) => (
                                    <button
                                      key={team._id}
                                      onClick={() => {
                                        if (team._id) {
                                          handleManualMatchChange('awayTeam', team._id);
                                          setManualMatch(prev => ({ ...prev, showAwayDropdown: false }));
                                        }
                                      }}
                                      className="w-full px-4 py-2 text-left text-white hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl transition-colors"
                                    >
                                      {team.name}
                                    </button>
                                  ));
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date and Time Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Date */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Match Date</label>
                          <input
                            type="date"
                            value={manualMatch.date}
                            onChange={(e) => handleManualMatchChange('date', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 hover:bg-white/10 transition-colors"
                          />
                        </div>

                        {/* Time */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Match Time</label>
                          <input
                            type="time"
                            value={manualMatch.time}
                            onChange={(e) => handleManualMatchChange('time', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 hover:bg-white/10 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Venue */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white">Venue</label>
                        <input
                          type="text"
                          value={manualMatch.venue}
                          onChange={(e) => handleManualMatchChange('venue', e.target.value)}
                          placeholder="Enter match venue"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 hover:bg-white/10 transition-colors"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <motion.button
                          onClick={() => {
                            setShowMatchCreation(false);
                            setSelectedGroup('');
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 sm:flex-none px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20"
                        >
                          Change Group
                        </motion.button>

                        <motion.button
                          onClick={handleManualMatchSubmit}
                          disabled={isLoading || !manualMatch.homeTeam || !manualMatch.awayTeam || !manualMatch.date || !manualMatch.time || !manualMatch.venue}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Creating Match...
                            </>
                          ) : (
                            <>
                              <Save size={20} className="mr-2" />
                              Create Match
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick Group Match Creation */}
                {selectedGroup && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6 rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Zap size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Quick Group Match Creation</h3>
                        <p className="text-gray-300 text-sm">Generate all possible matches between teams in the selected group</p>
                      </div>
                    </div>

                    <motion.button
                      onClick={async () => {
                        if (!selectedGroup) return;

                        const groupData = groups.find(g => g._id === selectedGroup);
                        if (!groupData || groupData.teams.length < 2) {
                          alert('Selected group must have at least 2 teams');
                          return;
                        }

                        setIsLoading(true);
                        const teamIds = groupData.teams;

                        try {
                          // Generate all possible match combinations
                          const matches = [];
                          for (let i = 0; i < teamIds.length; i++) {
                            for (let j = i + 1; j < teamIds.length; j++) {
                              const homeTeam = leagueTeams.find(t => t._id === teamIds[i]);
                              const awayTeam = leagueTeams.find(t => t._id === teamIds[j]);

                              if (homeTeam && awayTeam) {
                                matches.push({
                                  homeTeam: homeTeam.name,
                                  awayTeam: awayTeam.name,
                                  date: new Date().toISOString().split('T')[0], // Today
                                  time: '15:00', // Default time
                                  venue: 'TBD',
                                  leagueId: userLeague._id,
                                  status: 'scheduled',
                                  group: groupData.name
                                });
                              }
                            }
                          }

                          // Create all matches
                          for (const match of matches) {
                            await fetch('/api/matches', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(match),
                            });
                          }

                          alert(`Created ${matches.length} matches for ${groupData.name}!`);
                          router.refresh();

                        } catch (error) {
                          console.error('Error creating group matches:', error);
                          alert('Failed to create matches. Check console for details.');
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Zap size={20} />
                      Create All Group Matches ({(() => {
                        const groupData = groups.find(g => g._id === selectedGroup);
                        if (!groupData) return 0;
                        const n = groupData.teams.length;
                        return (n * (n - 1)) / 2; // Number of possible matches
                      })()})
                    </motion.button>
                  </motion.div>
                )}

                {/* Ungrouped Teams Warning */}
                {(() => {
                  const allGroupedTeamIds = groups.flatMap(g => g.teams);
                  const ungroupedTeams = leagueTeams.filter(team =>
                    team._id && !allGroupedTeamIds.includes(team._id)
                  );

                  return ungroupedTeams.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6 rounded-3xl border border-orange-400/20 bg-orange-500/5 backdrop-blur-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <AlertTriangle size={24} className="text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">Ungrouped Teams Detected</h3>
                          <p className="text-orange-200 mb-4">
                            {ungroupedTeams.length} team{ungroupedTeams.length !== 1 ? 's' : ''} are not assigned to any group.
                            These teams cannot participate in matches until they are grouped.
                          </p>

                          <div className="space-y-2 mb-4">
                            {ungroupedTeams.map((team) => (
                              <div key={team._id} className="text-orange-200 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                {team.name}
                              </div>
                            ))}
                          </div>

                          <motion.button
                            onClick={() => {
                              setShowGroupCreation(true);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                          >
                            <Users size={20} />
                            Group These Teams
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </>
            ) : (
              <>
                {/* Tab Navigation - For non-group stage leagues */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  {[
                    { key: 'manual', label: 'Manual Creation', icon: <Plus size={20} /> },
                    { key: 'automatic', label: 'Auto Generate', icon: <Zap size={20} /> }
                  ].map((tab) => (
                    <motion.button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as 'manual' | 'automatic')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                        activeTab === tab.key
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Tab Content */}
                {activeTab === 'manual' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                      <h2 className="text-2xl font-bold mb-6 text-white">Manual Match Creation</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Home Team */}
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-white">Home Team</label>
                          <div className="relative">
                            <button
                              onClick={() => setManualMatch(prev => ({ ...prev, showHomeDropdown: !prev.showHomeDropdown }))}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 flex items-center justify-between"
                            >
                              <span>{manualMatch.homeTeam ? getSelectedTeamName(manualMatch.homeTeam) || 'Select Home Team' : 'Select Home Team'}</span>
                              <ChevronDown size={20} />
                            </button>
                            {manualMatch.showHomeDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {leagueTeams.map((team) => (
                                  <button
                                    key={team._id}
                                    onClick={() => {
                                      if (team._id) {
                                        handleManualMatchChange('homeTeam', team._id);
                                        setManualMatch(prev => ({ ...prev, showHomeDropdown: false }));
                                      }
                                    }}
                                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl"
                                  >
                                    {team.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Away Team */}
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-white">Away Team</label>
                          <div className="relative">
                            <button
                              onClick={() => setManualMatch(prev => ({ ...prev, showAwayDropdown: !prev.showAwayDropdown }))}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 flex items-center justify-between"
                            >
                              <span>{manualMatch.awayTeam ? getSelectedTeamName(manualMatch.awayTeam) || 'Select Away Team' : 'Select Away Team'}</span>
                              <ChevronDown size={20} />
                            </button>
                            {manualMatch.showAwayDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {leagueTeams.map((team) => (
                                  <button
                                    key={team._id}
                                    onClick={() => {
                                      if (team._id) {
                                        handleManualMatchChange('awayTeam', team._id);
                                        setManualMatch(prev => ({ ...prev, showAwayDropdown: false }));
                                      }
                                    }}
                                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl"
                                  >
                                    {team.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Match Date</label>
                          <input
                            type="date"
                            value={manualMatch.date}
                            onChange={(e) => handleManualMatchChange('date', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                          />
                        </div>

                        {/* Time */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Match Time</label>
                          <input
                            type="time"
                            value={manualMatch.time}
                            onChange={(e) => handleManualMatchChange('time', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                          />
                        </div>

                        {/* Venue */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2 text-white">Venue</label>
                          <input
                            type="text"
                            value={manualMatch.venue}
                            onChange={(e) => handleManualMatchChange('venue', e.target.value)}
                            placeholder="Enter match venue"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                          />
                        </div>

                        {/* Referee */}
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-white">Referee (Optional)</label>
                          <div className="relative">
                            <button
                              onClick={() => setManualMatch(prev => ({ ...prev, showRefereeDropdown: !prev.showRefereeDropdown }))}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 flex items-center justify-between"
                            >
                              <span>{manualMatch.referee ? leagueReferees.find(r => r._id === manualMatch.referee)?.name || 'Select Referee' : 'Select Referee'}</span>
                              <ChevronDown size={20} />
                            </button>
                            {manualMatch.showRefereeDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                <button
                                  onClick={() => {
                                    handleManualMatchChange('referee', '');
                                    setManualMatch(prev => ({ ...prev, showRefereeDropdown: false }));
                                  }}
                                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 first:rounded-t-xl"
                                >
                                  No Referee
                                </button>
                                {leagueReferees.map((referee) => (
                                  <button
                                    key={referee._id}
                                    onClick={() => {
                                      if (referee._id) {
                                        handleManualMatchChange('referee', referee._id);
                                        setManualMatch(prev => ({ ...prev, showRefereeDropdown: false }));
                                      }
                                    }}
                                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 last:rounded-b-xl"
                                  >
                                    {referee.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Assistant Referee 1 */}
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-white">Assistant Referee 1 (Optional)</label>
                          <div className="relative">
                            <button
                              onClick={() => setManualMatch(prev => ({ ...prev, showAssistantReferee1Dropdown: !prev.showAssistantReferee1Dropdown }))}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 flex items-center justify-between"
                            >
                              <span>{manualMatch.assistantReferee1 ? leagueReferees.find(r => r._id === manualMatch.assistantReferee1)?.name || 'Select Assistant' : 'Select Assistant'}</span>
                              <ChevronDown size={20} />
                            </button>
                            {manualMatch.showAssistantReferee1Dropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                <button
                                  onClick={() => {
                                    handleManualMatchChange('assistantReferee1', '');
                                    setManualMatch(prev => ({ ...prev, showAssistantReferee1Dropdown: false }));
                                  }}
                                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 first:rounded-t-xl"
                                >
                                  No Assistant
                                </button>
                                {leagueReferees.map((referee) => (
                                  <button
                                    key={referee._id}
                                    onClick={() => {
                                      if (referee._id) {
                                        handleManualMatchChange('assistantReferee1', referee._id);
                                        setManualMatch(prev => ({ ...prev, showAssistantReferee1Dropdown: false }));
                                      }
                                    }}
                                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 last:rounded-b-xl"
                                  >
                                    {referee.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Assistant Referee 2 */}
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-white">Assistant Referee 2 (Optional)</label>
                          <div className="relative">
                            <button
                              onClick={() => setManualMatch(prev => ({ ...prev, showAssistantReferee2Dropdown: !prev.showAssistantReferee2Dropdown }))}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 flex items-center justify-between"
                            >
                              <span>{manualMatch.assistantReferee2 ? leagueReferees.find(r => r._id === manualMatch.assistantReferee2)?.name || 'Select Assistant' : 'Select Assistant'}</span>
                              <ChevronDown size={20} />
                            </button>
                            {manualMatch.showAssistantReferee2Dropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                <button
                                  onClick={() => {
                                    handleManualMatchChange('assistantReferee2', '');
                                    setManualMatch(prev => ({ ...prev, showAssistantReferee2Dropdown: false }));
                                  }}
                                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 first:rounded-t-xl"
                                >
                                  No Assistant
                                </button>
                                {leagueReferees.map((referee) => (
                                  <button
                                    key={referee._id}
                                    onClick={() => {
                                      if (referee._id) {
                                        handleManualMatchChange('assistantReferee2', referee._id);
                                        setManualMatch(prev => ({ ...prev, showAssistantReferee2Dropdown: false }));
                                      }
                                    }}
                                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 last:rounded-b-xl"
                                  >
                                    {referee.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Event Admin */}
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-white">Event Admin (Optional)</label>
                          <div className="relative">
                            <button
                              onClick={() => setManualMatch(prev => ({ ...prev, showEventAdminDropdown: !prev.showEventAdminDropdown }))}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 flex items-center justify-between"
                            >
                              <span>{manualMatch.eventAdmin ? users.find(u => u._id === manualMatch.eventAdmin)?.name || 'Select Admin' : 'Select Event Admin'}</span>
                              <ChevronDown size={20} />
                            </button>
                            {manualMatch.showEventAdminDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                <button
                                  onClick={() => {
                                    handleManualMatchChange('eventAdmin', '');
                                    setManualMatch(prev => ({ ...prev, showEventAdminDropdown: false }));
                                  }}
                                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 first:rounded-t-xl"
                                >
                                  No Event Admin
                                </button>
                                {users.filter(u => u.role === 'event-admin').map((admin) => (
                                  <button
                                    key={admin._id}
                                    onClick={() => {
                                      if (admin._id) {
                                        handleManualMatchChange('eventAdmin', admin._id);
                                        setManualMatch(prev => ({ ...prev, showEventAdminDropdown: false }));
                                      }
                                    }}
                                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 last:rounded-b-xl"
                                  >
                                    {admin.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2 text-white">Notes (Optional)</label>
                          <textarea
                            value={manualMatch.notes}
                            onChange={(e) => handleManualMatchChange('notes', e.target.value)}
                            placeholder="Additional notes about the match"
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="mt-8 flex justify-end">
                        <motion.button
                          onClick={handleManualMatchSubmit}
                          disabled={isLoading}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Creating Match...
                            </>
                          ) : (
                            <>
                              <Save size={20} />
                              Create Match
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'automatic' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                      <h2 className="text-2xl font-bold mb-6 text-white">Automatic Fixture Generation</h2>

                      <div className="space-y-6">
                        {/* Fixture Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white">Start Date</label>
                            <input
                              type="date"
                              value={fixtureSettings.startDate}
                              onChange={(e) => handleFixtureSettingsChange('startDate', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-white">Start Time</label>
                            <input
                              type="time"
                              value={fixtureSettings.startTime}
                              onChange={(e) => handleFixtureSettingsChange('startTime', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-white">Default Venue</label>
                            <input
                              type="text"
                              value={fixtureSettings.defaultVenue}
                              onChange={(e) => handleFixtureSettingsChange('defaultVenue', e.target.value)}
                              placeholder="Enter default venue"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                            />
                          </div>
                        </div>

                        {/* Matches Per Week */}
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Matches Per Week</label>
                          <select
                            value={fixtureSettings.matchesPerWeek}
                            onChange={(e) => handleFixtureSettingsChange('matchesPerWeek', parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                          >
                            <option value={1}>1 match per week</option>
                            <option value={2}>2 matches per week</option>
                            <option value={3}>3 matches per week</option>
                            <option value={4}>4 matches per week</option>
                            <option value={5}>5 matches per week</option>
                            <option value={6}>6 matches per week</option>
                            <option value={7}>7 matches per week</option>
                          </select>
                        </div>

                        {/* Include Referees */}
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="includeReferees"
                            checked={fixtureSettings.includeReferees}
                            onChange={(e) => handleFixtureSettingsChange('includeReferees', e.target.checked)}
                            className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label htmlFor="includeReferees" className="text-white font-medium">
                            Include referees and event admins in fixture generation
                          </label>
                        </div>

                        {/* League Info */}
                        {userLeague && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 rounded-2xl border border-white/10 backdrop-blur-xl"
                          >
                            <h3 className="text-lg font-bold mb-4 text-white">League Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Format:</span>
                                <span className="text-white ml-2 capitalize">{userLeague.type?.format?.replace('_', ' ')}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Teams:</span>
                                <span className="text-white ml-2">{leagueTeams.length} teams</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Home/Away:</span>
                                <span className="text-white ml-2">{userLeague.type?.hasHomeAway ? 'Yes' : 'No'}</span>
                              </div>
                              {userLeague.type?.format === 'knockout' && (
                                <div>
                                  <span className="text-gray-400">Rounds:</span>
                                  <span className="text-white ml-2">{userLeague.type?.knockoutRounds || 3}</span>
                                </div>
                              )}
                              {userLeague.type?.format === 'group_stage' && (
                                <div>
                                  <span className="text-gray-400">Groups:</span>
                                  <span className="text-white ml-2">{userLeague.type?.groupCount || 4}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Generate Button */}
                        <div className="flex justify-center">
                          <motion.button
                            onClick={generateFixtures}
                            disabled={!fixtureSettings.startDate || !fixtureSettings.startTime || !fixtureSettings.defaultVenue || leagueTeams.length < 2}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Zap size={20} />
                            Generate Fixtures
                          </motion.button>
                        </div>

                        {/* Generated Fixtures Display */}
                        {generatedFixtures.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <h3 className="text-xl font-bold text-white">Generated Fixtures ({generatedFixtures.length})</h3>

                            <div className="max-h-96 overflow-y-auto space-y-3">
                              {generatedFixtures.map((fixture, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="glass-card p-4 rounded-xl border border-white/10 backdrop-blur-xl"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-4 mb-2">
                                        <span className="font-bold text-white">{fixture.homeTeam}</span>
                                        <span className="text-gray-400">vs</span>
                                        <span className="font-bold text-white">{fixture.awayTeam}</span>
                                      </div>
                                      <div className="flex items-center gap-6 text-sm text-gray-400">
                                        <span>Round {fixture.round}</span>
                                        <span>{fixture.date} at {fixture.time}</span>
                                        <span>{fixture.venue}</span>
                                        {fixture.roundName && <span>{fixture.roundName}</span>}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                                        {fixture.status}
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-center pt-4">
                              <motion.button
                                onClick={saveGeneratedFixtures}
                                disabled={isLoading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isLoading ? (
                                  <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving Fixtures...
                                  </>
                                ) : (
                                  <>
                                    <Save size={20} />
                                    Save All Fixtures ({generatedFixtures.length})
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </motion.div>
                        )}

                        {/* Saving Progress */}
                        {savingProgress && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 rounded-2xl border border-white/10 backdrop-blur-xl"
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <Clock size={16} className="text-blue-400" />
                              </div>
                              <div>
                                <h4 className="font-bold text-white">Saving Fixtures</h4>
                                <p className="text-gray-400 text-sm">{savingProgress.message}</p>
                              </div>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(savingProgress.current / savingProgress.total) * 100}%` }}
                              />
                            </div>
                            <p className="text-center text-gray-400 text-sm mt-2">
                              {savingProgress.current} of {savingProgress.total} matches saved
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
