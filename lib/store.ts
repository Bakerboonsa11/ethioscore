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
  password?: string;
  role: 'super-admin' | 'org-admin';
  phone?: string;
  organization?: {
    _id: string;
    name: string;
  } | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  status: 'scheduled' | 'live' | 'completed';
}

interface AppState {
  organizations: Organization[];
  leagues: League[];
  matches: Match[];
  users: User[];
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

  setMatches: (matches: Match[]) => void;
  addMatch: (match: Match) => void;

  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  fetchUsers: () => Promise<void>;

  setUser: (user: User | null) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<User | { requiresApproval: true; error: string; organizationStatus?: string }>;
  signup: (formData: any, role?: string) => Promise<User>;
}

export const useAppStore = create<AppState>((set, get) => ({
  organizations: [],
  leagues: [],
  matches: [],
  users: [], // Add users to initial state
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

  setMatches: (matches: Match[]) => set({ matches }),
  addMatch: (match: Match) =>
    set((state) => ({ matches: [...state.matches, match] })),

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
  logout: () => set({ user: null, organizations: [], leagues: [], matches: [] }),

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
}));
