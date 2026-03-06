import { create } from 'zustand';
import User, { IUser } from './models/User';
import Organization, { IOrganization } from './models/Organization';

export interface Organization {
  id?: string;
  _id?: string;
  name: string;
  country: string;
  logo?: string;
  leaguesCount: number;
  status: 'pending' | 'approved';
}

export interface League {
  id?: string;
  _id?: string;
  name: string;
  logo?: string;
  year: number;
  region?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  organization: {
    _id: string;
    name: string;
  } | string;
  tier?: number;
  type: {
    format: 'league' | 'knockout' | 'group_stage';
    hasHomeAway: boolean;
    groupCount?: number;
    knockoutRounds?: number;
  };
  status: 'draft' | 'active' | 'completed';
  teamsCount?: number;
  matchesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: string;
  _id?: string;
  email: string;
  username: string;
  name?: string;
  password?: string;
  role: 'super-admin' | 'org-admin' | 'league-admin' | 'club-admin' | 'event-admin' | 'referee';
  phone?: string;
  organization?: {
    _id: string;
    name: string;
  } | string;
  league?: {
    _id: string;
    name: string;
  } | string;
  team?: {
    _id: string;
    name: string;
  } | string; // For club-admin users
  createdAt?: string;
  updatedAt?: string;
}

export interface Team {
  id?: string;
  _id?: string;
  name: string;
  logo?: string;
  founded: number;
  location: string;
  stadium?: string;
  manager?: string;
  website?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  league: {
    _id: string;
    name: string;
  } | string;
  organization: {
    _id: string;
    name: string;
  } | string;
  clubAdmin?: {
    _id: string;
    name: string;
    email: string;
  } | string;
  status: 'active' | 'inactive' | 'suspended';
  playersCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Match {
  id?: string;
  _id?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  venue?: string;
  leagueId?: string;
  status: 'scheduled' | 'live' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface Player {
  id?: string;
  _id?: string;
  name: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  jerseyNumber: number;
  age: number;
  nationality: string;
  email: string;
  phone: string;
  status: 'active' | 'injured' | 'suspended';
  goals: number;
  assists: number;
  appearances: number;
  joinedDate: string;
  contractEnd: string;
  team: {
    _id: string;
    name: string;
  } | string;
  height?: number;
  weight?: number;
  preferredFoot?: 'left' | 'right' | 'both';
  dateOfBirth: string;
  placeOfBirth?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface AppState {
  organizations: Organization[];
  leagues: League[];
  matches: Match[];
  teams: Team[];
  users: User[];
  players: Player[];
  user: User | null;

  // Actions
  setOrganizations: (orgs: Organization[]) => void;
  addOrganization: (org: Organization) => void;
  fetchOrganizations: () => Promise<void>;

  setLeagues: (leagues: League[]) => void;
  addLeague: (league: League) => void;
  fetchLeagues: (organizationId?: string) => Promise<void>;
  createLeague: (leagueData: any) => Promise<League>;
  updateLeague: (id: string, leagueData: any) => Promise<League>;
  deleteLeague: (id: string) => Promise<void>;

  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  fetchTeams: (leagueId?: string) => Promise<void>;
  createTeam: (teamData: any) => Promise<Team>;
  updateTeam: (id: string, teamData: any) => Promise<Team>;
  deleteTeam: (id: string) => Promise<void>;

  setMatches: (matches: Match[]) => void;
  addMatch: (match: Match) => void;
  fetchMatches: (leagueId?: string) => Promise<void>;

  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  fetchUsers: () => Promise<void>;

  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  fetchPlayers: (teamId?: string) => Promise<void>;
  createPlayer: (playerData: any) => Promise<Player>;
  updatePlayer: (id: string, playerData: any) => Promise<Player>;
  deletePlayer: (id: string) => Promise<void>;

  setUser: (user: User | null) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<User | { requiresApproval: true; error: string; organizationStatus?: string }>;
  signup: (formData: any, role?: string) => Promise<User>;
  createUser: (userData: any) => Promise<User>;
  updateUser: (userId: string, userData: any) => Promise<User>;
}

export const useAppStore = create<AppState>((set, get) => ({
  organizations: [],
  leagues: [],
  matches: [],
  teams: [], // Add teams to initial state
  users: [],
  players: [], // Add players to initial state
  user: null,
  
  setOrganizations: (orgs: Organization[]) => set({ organizations: orgs }),
  addOrganization: (org: Organization) =>
    set((state) => ({ organizations: [...state.organizations, org] })),
  fetchOrganizations: async () => {
    const response = await fetch('/api/organizations');
    if (response.ok) {
      const orgs = await response.json();
      set({ organizations: orgs });
    }
  },
  
  setLeagues: (leagues: League[]) => set({ leagues }),
  addLeague: (league: League) =>
    set((state) => ({ leagues: [...state.leagues, league] })),

  fetchLeagues: async (organizationId?: string) => {
    const url = organizationId
      ? `/api/leagues?organization=${organizationId}`
      : '/api/leagues';
    const response = await fetch(url);
    if (response.ok) {
      const leagues = await response.json();
      set({ leagues });
    }
  },

  createLeague: async (leagueData: any) => {
    const response = await fetch('/api/leagues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leagueData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const league = await response.json();
    get().addLeague(league);
    return league;
  },

  updateLeague: async (id: string, leagueData: any) => {
    const response = await fetch(`/api/leagues/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leagueData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const league = await response.json();
    set((state) => ({
      leagues: state.leagues.map((l) => (l._id === id || l.id === id ? league : l)),
    }));
    return league;
  },

  deleteLeague: async (id: string) => {
    const response = await fetch(`/api/leagues/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    set((state) => ({
      leagues: state.leagues.filter((l) => l._id !== id && l.id !== id),
    }));
  },

  setTeams: (teams: Team[]) => set({ teams }),
  addTeam: (team: Team) =>
    set((state) => ({ teams: [...state.teams, team] })),

  fetchTeams: async (leagueId?: string) => {
    const url = leagueId ? `/api/teams?leagueId=${leagueId}` : '/api/teams';
    const response = await fetch(url);
    if (response.ok) {
      const teams = await response.json();
      set({ teams });
    }
  },

  createTeam: async (teamData: any) => {
    const response = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const team = await response.json();
    get().addTeam(team);
    return team;
  },

  updateTeam: async (id: string, teamData: any) => {
    const response = await fetch(`/api/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const team = await response.json();
    set((state) => ({
      teams: state.teams.map((t) => (t._id === id || t.id === id ? team : t)),
    }));
    return team;
  },

  deleteTeam: async (id: string) => {
    const response = await fetch(`/api/teams/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    set((state) => ({
      teams: state.teams.filter((t) => t._id !== id && t.id !== id),
    }));
  },

  setMatches: (matches: Match[]) => set({ matches }),
  addMatch: (match: Match) =>
    set((state) => ({ matches: [...state.matches, match] })),

  fetchMatches: async (leagueId?: string) => {
    const url = leagueId ? `/api/matches?leagueId=${leagueId}` : '/api/matches';
    const response = await fetch(url);
    if (response.ok) {
      const matches = await response.json();
      set({ matches });
    }
  },

  setUsers: (users: User[]) => set({ users }),
  addUser: (user: User) =>
    set((state) => ({ users: [...state.users, user] })),
  fetchUsers: async () => {
    const response = await fetch('/api/users');
    if (response.ok) {
      const users = await response.json();
      set({ users });
    }
  },

  setUser: (user: User | null) => set({ user }),
  logout: () => set({ user: null, organizations: [], leagues: [], teams: [], matches: [] }),

  login: async (username: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // For organization approval required (403 with requiresApproval), return the data
      // so the frontend can handle it appropriately
      if (response.status === 403 && data.requiresApproval) {
        return data;
      }
      // For other errors, throw as before
      throw new Error(data.error);
    }

    const { user } = data;
    set({ user });
    return user;
  },

  signup: async (formData: any, role = 'org-admin') => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, role }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const { user } = await response.json();
    set({ user });
    return user;
  },

  createUser: async (userData: any) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const { user } = await response.json();
    get().addUser(user);
    return user;
  },

  updateUser: async (userId: string, userData: any) => {
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...userData }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const { user } = await response.json();
    set((state) => ({
      users: state.users.map((u) => (u._id === userId || u.id === userId ? user : u)),
    }));
  },

  setPlayers: (players: Player[]) => set({ players }),
  addPlayer: (player: Player) =>
    set((state) => ({ players: [...state.players, player] })),

  fetchPlayers: async (teamId?: string) => {
    const url = teamId ? `/api/players?teamId=${teamId}` : '/api/players';
    const response = await fetch(url);
    if (response.ok) {
      const players = await response.json();
      set({ players });
    }
  },

  createPlayer: async (playerData: any) => {
    const response = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const player = await response.json();
    get().addPlayer(player);
    return player;
  },

  updatePlayer: async (id: string, playerData: any) => {
    const response = await fetch(`/api/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const player = await response.json();
    set((state) => ({
      players: state.players.map((p) => (p._id === id || p.id === id ? player : p)),
    }));
    return player;
  },

  deletePlayer: async (id: string) => {
    const response = await fetch(`/api/players/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    set((state) => ({
      players: state.players.filter((p) => p._id !== id && p.id !== id),
    }));
  }
}));
