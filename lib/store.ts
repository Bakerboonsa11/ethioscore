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
  id: string;
  name: string;
  organization: string;
  teamsCount: number;
  matchesCount: number;
  status: 'active' | 'completed' | 'draft';
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
  users: IUser[];
  user: IUser | null;
  
  // Actions
  setOrganizations: (orgs: Organization[]) => void;
  addOrganization: (org: Organization) => void;
  fetchOrganizations: () => Promise<void>;
  
  setLeagues: (leagues: League[]) => void;
  addLeague: (league: League) => void;
  
  setMatches: (matches: Match[]) => void;
  addMatch: (match: Match) => void;
  
  setUsers: (users: IUser[]) => void;
  addUser: (user: IUser) => void;
  fetchUsers: () => Promise<void>;
  
  setUser: (user: IUser | null) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<IUser | { requiresApproval: true; error: string; organizationStatus?: string }>;
  signup: (formData: any, role?: string) => Promise<IUser>;
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
  
  setMatches: (matches: Match[]) => set({ matches }),
  addMatch: (match: Match) =>
    set((state) => ({ matches: [...state.matches, match] })),
  
  setUsers: (users: IUser[]) => set({ users }),
  addUser: (user: IUser) =>
    set((state) => ({ users: [...state.users, user] })),
  fetchUsers: async () => {
    const response = await fetch('/api/users');
    if (response.ok) {
      const users = await response.json();
      set({ users });
    }
  },
  
  setUser: (user: IUser | null) => set({ user }),
  logout: () => set({ user: null, organizations: [], leagues: [], matches: [] }),

  login: async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
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
