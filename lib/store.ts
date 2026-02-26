import { create } from 'zustand';

export interface Organization {
  id: string;
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
  user: { id: string; email: string; role: 'super-admin' | 'org-admin' } | null;
  
  // Actions
  setOrganizations: (orgs: Organization[]) => void;
  addOrganization: (org: Organization) => void;
  fetchOrganizations: () => Promise<void>;
  
  setLeagues: (leagues: League[]) => void;
  addLeague: (league: League) => void;
  
  setMatches: (matches: Match[]) => void;
  addMatch: (match: Match) => void;
  
  setUser: (user: AppState['user']) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (formData: any, role?: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  organizations: [],
  leagues: [],
  matches: [],
  user: null,
  
  setOrganizations: (orgs) => set({ organizations: orgs }),
  addOrganization: (org) =>
    set((state) => ({ organizations: [...state.organizations, org] })),
  fetchOrganizations: async () => {
    const response = await fetch('/api/organizations');
    if (response.ok) {
      const orgs = await response.json();
      set({ organizations: orgs });
    }
  },
  
  setLeagues: (leagues) => set({ leagues }),
  addLeague: (league) =>
    set((state) => ({ leagues: [...state.leagues, league] })),
  
  setMatches: (matches) => set({ matches }),
  addMatch: (match) =>
    set((state) => ({ matches: [...state.matches, match] })),
  
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, organizations: [], leagues: [], matches: [] }),

  login: async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    const { user } = await response.json();
    set({ user });
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
    // Optionally login after signup
    await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    }).then(async (res) => {
      if (res.ok) {
        const { user } = await res.json();
        set({ user });
      }
    });
  },
}));
