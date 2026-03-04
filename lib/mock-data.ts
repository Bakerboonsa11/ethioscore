import { Organization, League, Match } from './store';

export const mockOrganizations: Organization[] = [
  {
    id: '1',
    _id: '507f1f77bcf86cd799439001',
    name: 'Ethiopian Premier League',
    country: 'Ethiopia',
    leaguesCount: 12,
    status: 'approved',
  },
  {
    id: '2',
    _id: '507f1f77bcf86cd799439002',
    name: 'Oromia Football Federation',
    country: 'Ethiopia',
    leaguesCount: 8,
    status: 'approved',
  },
  {
    id: '3',
    _id: '507f1f77bcf86cd799439003',
    name: 'Addis Ababa Sports Commission',
    country: 'Ethiopia',
    leaguesCount: 5,
    status: 'pending',
  },
  {
    id: '4',
    _id: '507f1f77bcf86cd799439004',
    name: 'Amhara Regional Football Association',
    country: 'Ethiopia',
    leaguesCount: 6,
    status: 'pending',
  },
];

export const mockLeagues: League[] = [
  {
    id: 'l1',
    _id: '507f1f77bcf86cd799439011',
    name: 'Ethiopian Premier Division',
    organization: '507f1f77bcf86cd799439001',
    teamsCount: 16,
    matchesCount: 240,
    status: 'active',
  },
  {
    id: 'l2',
    _id: '507f1f77bcf86cd799439012',
    name: 'First Division',
    organization: '507f1f77bcf86cd799439001',
    teamsCount: 14,
    matchesCount: 182,
    status: 'active',
  },
  {
    id: 'l3',
    _id: '507f1f77bcf86cd799439013',
    name: 'Oromia Premier',
    organization: '507f1f77bcf86cd799439002',
    teamsCount: 12,
    matchesCount: 132,
    status: 'active',
  },
  {
    id: 'l4',
    _id: '507f1f77bcf86cd799439014',
    name: 'Addis Ababa City Cup',
    organization: '507f1f77bcf86cd799439003',
    teamsCount: 8,
    matchesCount: 56,
    status: 'completed',
  },
];

export const mockMatches: Match[] = [
  {
    id: 'm1',
    homeTeam: 'Saint George SC',
    awayTeam: 'Addis Ababa City FC',
    homeScore: 2,
    awayScore: 1,
    date: '2024-02-20',
    status: 'completed',
  },
  {
    id: 'm2',
    homeTeam: 'Dire Dawa FC',
    awayTeam: 'Adama City',
    homeScore: 1,
    awayScore: 1,
    date: '2024-02-21',
    status: 'completed',
  },
  {
    id: 'm3',
    homeTeam: 'Ethiopian Coffee SC',
    awayTeam: 'Adama Kenema',
    homeScore: 0,
    awayScore: 0,
    date: '2024-02-22',
    status: 'live',
  },
  {
    id: 'm4',
    homeTeam: 'Addis Ababa University',
    awayTeam: 'Bahir Dar City FC',
    homeScore: 0,
    awayScore: 0,
    date: '2024-02-23',
    status: 'scheduled',
  },
  {
    id: 'm5',
    homeTeam: 'Mekelle FC',
    awayTeam: 'Jimma Aba Jifar',
    homeScore: 0,
    awayScore: 0,
    date: '2024-02-24',
    status: 'scheduled',
  },
];

export const mockChartData = [
  { month: 'Jan', organizations: 4, leagues: 8, matches: 45 },
  { month: 'Feb', organizations: 6, leagues: 12, matches: 78 },
  { month: 'Mar', organizations: 9, leagues: 18, matches: 125 },
  { month: 'Apr', organizations: 12, leagues: 24, matches: 195 },
  { month: 'May', organizations: 15, leagues: 32, matches: 280 },
  { month: 'Jun', organizations: 18, leagues: 40, matches: 385 },
];
