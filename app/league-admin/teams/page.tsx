'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Edit2, Trophy, MapPin, Calendar, Search, Filter, X, Check, Upload, Palette, Globe, Facebook, Twitter, Instagram, Crown, Sparkles, Star, Flame, Rocket, Thunderbolt, TrendingUp } from 'lucide-react';
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

// Ultra performance themes
const performanceThemes = {
  excellent: {
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/50',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    icon: '🚀'
  },
  good: {
    gradient: 'from-blue-500 via-cyan-500 to-sky-500',
    glow: 'shadow-blue-500/50',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    icon: '⚡'
  },
  average: {
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    glow: 'shadow-yellow-500/50',
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    icon: '⭐'
  },
  poor: {
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    glow: 'shadow-red-500/50',
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    icon: '💪'
  }
};

const TeamModal = ({
  isOpen,
  onClose,
  title,
  mode, // 'create', 'edit', 'add-existing'
  existingTeam,
  league,
  onTeamChange,
  setActiveModal,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  mode: 'create' | 'edit' | 'add-existing';
  existingTeam?: any;
  league: any;
  onTeamChange?: (team: any) => void;
  setActiveModal: (modal: string | null) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'branding' | 'social' | 'club-admin'>('details');
  const [searchTerm, setSearchTerm] = useState('');
  const [yearSearch, setYearSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { teams, createTeam, updateTeam, users, fetchUsers } = useAppStore();

  // Filter club admins
  const clubAdmins = users.filter(user => user.role === 'club-admin');

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    founded: new Date().getFullYear(),
    location: '',
    stadium: '',
    manager: '',
    website: '',
    colors: { primary: '#1e40af', secondary: '#ffffff' },
    socialMedia: { facebook: '', twitter: '', instagram: '' },
    status: 'active' as const,
    clubAdmin: null as any,
  });

  // Initialize form data when editing
  useEffect(() => {
    if (existingTeam && mode === 'edit') {
      setFormData({
        name: existingTeam.name || '',
        logo: existingTeam.logo || '',
        founded: existingTeam.founded || new Date().getFullYear(),
        location: existingTeam.location || '',
        stadium: existingTeam.stadium || '',
        manager: existingTeam.manager || '',
        website: existingTeam.website || '',
        colors: existingTeam.colors || { primary: '#1e40af', secondary: '#ffffff' },
        socialMedia: existingTeam.socialMedia || { facebook: '', twitter: '', instagram: '' },
        status: existingTeam.status || 'active',
        clubAdmin: existingTeam.clubAdmin || null,
      });
    }
  }, [existingTeam, mode]);

  // Filter teams for add-existing mode
  const availableTeams = teams.filter(team => {
    const teamOrgId = typeof team.organization === 'object' ? team.organization._id : team.organization;
    const leagueOrgId = typeof league.organization === 'object' ? league.organization._id : league.organization;
    const teamLeagueId = typeof team.league === 'object' ? team.league._id : team.league;
    const currentLeagueId = league._id;

    const matchesName = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearSearch === '' || team.founded.toString().includes(yearSearch);

    return team.status === 'active' &&
      teamOrgId === leagueOrgId &&
      teamLeagueId !== currentLeagueId &&
      matchesName &&
      matchesYear;
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.founded || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'edit' && existingTeam) {
        const teamData = {
          ...formData,
          leagueId: league._id,
          organizationId: typeof league.organization === 'object' ? league.organization._id : league.organization,
        };
        const updatedTeam = await updateTeam(existingTeam._id, teamData);
        onTeamChange?.(updatedTeam);
      } else {
        const teamData = {
          ...formData,
          leagueId: league._id,
          organizationId: typeof league.organization === 'object' ? league.organization._id : league.organization,
        };
        const newTeam = await createTeam(teamData);
        onTeamChange?.(newTeam);
      }
      onClose();
    } catch (error: any) {
      alert(`Failed to ${mode === 'edit' ? 'update' : 'create'} team: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddExisting = async () => {
    if (!selectedTeam) return;

    setIsSubmitting(true);
    try {
      // Update the team to be assigned to this league
      const teamData = {
        league: league._id,
        organization: typeof league.organization === 'object' ? league.organization._id : league.organization,
      };
      const updatedTeam = await updateTeam(selectedTeam._id, teamData);
      onTeamChange?.(updatedTeam);
      onClose();
    } catch (error: any) {
      alert(`Failed to add team: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'add-existing') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-accent/20 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      placeholder="Search teams by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      placeholder="Search by founded year..."
                      value={yearSearch}
                      onChange={(e) => setYearSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {availableTeams.map((team) => (
                    <div
                      key={team._id}
                      className={`flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors cursor-pointer ${
                        selectedTeam?._id === team._id ? 'ring-2 ring-accent' : ''
                      }`}
                      onClick={() => setSelectedTeam(team)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">{team.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-sm text-muted-foreground">{team.location} • Founded {team.founded}</p>
                        </div>
                      </div>
                      {selectedTeam?._id === team._id && <Check size={20} className="text-accent" />}
                    </div>
                  ))}
                  {availableTeams.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No available teams found</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={onClose} className="px-4 py-2 bg-card hover:bg-card/80 border border-border rounded-lg">
                  Cancel
                </button>
                <button
                  onClick={handleAddExisting}
                  disabled={!selectedTeam || isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-accent to-secondary text-accent-foreground font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Add Team'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-accent/20 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              {[
                { key: 'details', label: 'Basic Details', icon: <Users size={16} /> },
                { key: 'branding', label: 'Branding', icon: <Palette size={16} /> },
                { key: 'social', label: 'Social Media', icon: <Globe size={16} /> },
                { key: 'club-admin', label: 'Club Admin', icon: <Users size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key as any);
                    if (tab.key === 'club-admin') {
                      fetchUsers();
                    }
                  }}
                  className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Team Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter team name"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Founded Year *</label>
                    <input
                      type="number"
                      value={formData.founded}
                      onChange={(e) => setFormData(prev => ({ ...prev, founded: parseInt(e.target.value) }))}
                      placeholder="2024"
                      min="1800"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stadium</label>
                    <input
                      type="text"
                      value={formData.stadium}
                      onChange={(e) => setFormData(prev => ({ ...prev, stadium: e.target.value }))}
                      placeholder="Home stadium name"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Manager</label>
                    <input
                      type="text"
                      value={formData.manager}
                      onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                      placeholder="Current manager"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://teamwebsite.com"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'branding' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Team Logo URL</label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.colors.primary}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                          className="w-12 h-10 border border-border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.colors.primary}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                          placeholder="#1e40af"
                          className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Secondary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.colors.secondary}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                          className="w-12 h-10 border border-border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.colors.secondary}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                          placeholder="#ffffff"
                          className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Facebook size={20} className="text-blue-600" />
                    <span className="text-sm font-medium">Social Media Links</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Facebook</label>
                    <input
                      type="url"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                      }))}
                      placeholder="https://facebook.com/team"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter</label>
                    <input
                      type="url"
                      value={formData.socialMedia.twitter}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                      }))}
                      placeholder="https://twitter.com/team"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram</label>
                    <input
                      type="url"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                      }))}
                      placeholder="https://instagram.com/team"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'club-admin' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={20} className="text-accent" />
                    <span className="text-sm font-medium">Club Administrator</span>
                  </div>

                  {formData.clubAdmin ? (
                    <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                            <span className="text-accent font-bold">
                              {typeof formData.clubAdmin === 'object' ? formData.clubAdmin.name?.charAt(0) || formData.clubAdmin.email.charAt(0) : 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {typeof formData.clubAdmin === 'object' ? formData.clubAdmin.name || formData.clubAdmin.email : 'Assigned Admin'}
                            </p>
                            <p className="text-sm text-muted-foreground">Club Administrator</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, clubAdmin: null }))}
                          className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                          type="text"
                          placeholder="Search club admins by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        />
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {clubAdmins.filter(admin =>
                          admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          admin.email.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((admin) => (
                          <div
                            key={admin._id}
                            className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors cursor-pointer"
                            onClick={() => setFormData(prev => ({ ...prev, clubAdmin: admin }))}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                                <span className="text-accent font-bold text-sm">
                                  {admin.name?.charAt(0) || admin.username.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{admin.name || admin.username}</p>
                                <p className="text-xs text-muted-foreground">{admin.email}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {clubAdmins.length === 0 && (
                          <p className="text-center text-muted-foreground py-4 text-sm">No club admins found</p>
                        )}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => setActiveModal('create-club-admin')}
                          className="w-full px-4 py-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 rounded-lg text-sm transition-colors"
                        >
                          + Create New Club Admin
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6">
              <button onClick={onClose} className="px-4 py-2 bg-card hover:bg-card/80 border border-border rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-accent to-secondary text-accent-foreground font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Team' : 'Create Team')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function LeagueAdminTeamsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const { user, leagues, teams, fetchTeams, fetchLeagues, createTeam, updateTeam, deleteTeam } = useAppStore();

  // Get the league that this admin manages
  const userLeague = leagues.find(league =>
    league._id === (typeof user?.league === 'string' ? user.league : user?.league?._id)
  );

  useEffect(() => {
    const loadData = async () => {
      await fetchLeagues(); // Fetch leagues from database
      setIsLoading(false);
    };
    loadData();
  }, [fetchLeagues]);

  useEffect(() => {
    const loadTeams = async () => {
      if (userLeague) {
        await fetchTeams(); // Fetch all teams to enable add existing from other leagues
      }
    };
    loadTeams();
  }, [userLeague, fetchTeams]);

  // Filter teams based on search and status - only show teams for this league
  const filteredTeams = teams.filter(team => {
    // First check if team belongs to this league
    const teamLeagueId = typeof team.league === 'object' ? team.league._id : team.league;
    const currentLeagueId = userLeague._id;
    const belongsToLeague = teamLeagueId === currentLeagueId;

    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (team.manager && team.manager.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || team.status === statusFilter;

    return belongsToLeague && matchesSearch && matchesStatus;
  });

  // Calculate stats - only for teams in this league
  const leagueTeams = teams.filter(team => {
    const teamLeagueId = typeof team.league === 'object' ? team.league._id : team.league;
    return teamLeagueId === userLeague._id;
  });
  const activeTeams = leagueTeams.filter(t => t.status === 'active');
  const totalPlayers = activeTeams.reduce((sum, team) => sum + (team.playersCount || 0), 0);
  const uniqueCities = new Set(activeTeams.map(team => team.location)).size;
  const oldestTeam = activeTeams.length > 0 ? Math.min(...activeTeams.map(team => team.founded)) : null;

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
            <div className="flex gap-3">
              <motion.button
                onClick={() => setActiveModal('manage-club-admins')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-card/80 border border-border rounded-lg font-semibold"
              >
                <Users size={20} />
                Club Admins
              </motion.button>
              <motion.button
                onClick={() => setActiveModal('add-existing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-card/80 border border-border rounded-lg font-semibold"
              >
                <Users size={20} />
                Add Existing
              </motion.button>
              <motion.button
                onClick={() => setActiveModal('create')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                <Plus size={20} />
                Create Team
              </motion.button>
            </div>
          }
        >
          <div className="space-y-8">
            {/* Ultra Teams Stats Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {[
                {
                  title: 'Active Teams',
                  value: activeTeams.length.toString(),
                  icon: '⚽',
                  trend: { value: 2, isPositive: true },
                  gradient: 'from-green-500 to-emerald-500',
                  glow: 'shadow-green-500/50'
                },
                {
                  title: 'Total Players',
                  value: totalPlayers.toString(),
                  icon: '👥',
                  trend: { value: 12, isPositive: true },
                  gradient: 'from-blue-500 to-cyan-500',
                  glow: 'shadow-blue-500/50'
                },
                {
                  title: 'Cities',
                  value: uniqueCities.toString(),
                  icon: '🏙️',
                  trend: { value: 1, isPositive: true },
                  gradient: 'from-orange-500 to-red-500',
                  glow: 'shadow-orange-500/50'
                },
                {
                  title: 'Oldest Club',
                  value: oldestTeam ? oldestTeam.toString() : '-',
                  icon: '🏆',
                  trend: { value: 0, isPositive: true },
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

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Search teams by name, location, or manager..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </motion.div>

            {/* Teams Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    League Teams
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} in {userLeague?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-2xl backdrop-blur-sm">
                  <Users size={16} className="text-accent" />
                  <span className="text-sm font-semibold text-foreground">
                    {filteredTeams.length} Total
                  </span>
                </div>
              </div>

              {filteredTeams.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users size={48} className="text-accent/60" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">No Teams Found</h3>
                  <p className="text-muted-foreground/80">Try adjusting your search criteria or create a new team</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTeams.map((team, i) => (
                    <motion.div
                      key={team._id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.1 + i * 0.05,
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.03,
                        rotateY: 5,
                        transition: { duration: 0.3 }
                      }}
                      className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${team.colors?.primary || '#1e40af'} 0%, ${team.colors?.secondary || '#ffffff'} 100%)`,
                      }}
                    >
                      {/* Ultra Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${team.colors?.primary ? 'from-blue-500/30' : 'from-purple-500/30'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

                      {/* Animated Border */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Content */}
                      <div className="relative p-6 text-white z-10">
                        {/* Top row: Logo, Name, Status, Edit */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            {team.logo ? (
                              <motion.img
                                src={team.logo}
                                alt={team.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-lg group-hover:shadow-xl transition-all"
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              />
                            ) : (
                              <motion.div
                                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg group-hover:shadow-xl transition-all"
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <span className="text-white font-black text-xl">
                                  {team.name.charAt(0)}
                                </span>
                              </motion.div>
                            )}
                            <div>
                              <motion.h3
                                className="text-2xl font-bold text-white drop-shadow-lg mb-1 group-hover:scale-105 transition-transform"
                                whileHover={{ scale: 1.05 }}
                              >
                                {team.name}
                              </motion.h3>
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-white/80" />
                                <span className="text-white/90 font-medium text-sm">{team.location}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <motion.div
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md border border-white/30 ${
                                team.status === 'active'
                                  ? 'bg-green-500/30 text-green-100 border-green-400/30'
                                  : team.status === 'inactive'
                                    ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/30'
                                    : 'bg-red-500/30 text-red-100 border-red-400/30'
                              }`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                            </motion.div>

                            <motion.button
                              onClick={() => {
                                setSelectedTeam(team);
                                setActiveModal('select-club-admin');
                              }}
                              whileHover={{ scale: 1.2, rotate: 15 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg border border-white/30 transition-all duration-200 shadow-md group-hover:shadow-lg"
                              title="Assign Club Admin"
                            >
                              <Users size={16} className="text-white" />
                            </motion.button>

                            <motion.button
                              onClick={() => {
                                setSelectedTeam(team);
                                setActiveModal('edit');
                              }}
                              whileHover={{ scale: 1.2, rotate: 15 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg border border-white/30 transition-all duration-200 shadow-md group-hover:shadow-lg"
                            >
                              <Edit2 size={16} className="text-white" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Bottom row: Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Calendar size={14} className="text-white/70" />
                            <span className="text-white/90 font-medium">Founded {team.founded}</span>
                          </motion.div>

                          {team.stadium && (
                            <motion.div
                              className="flex items-center gap-2"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Trophy size={14} className="text-white/70" />
                              <span className="text-white/90 font-medium">{team.stadium}</span>
                            </motion.div>
                          )}

                          {team.playersCount && (
                            <motion.div
                              className="flex items-center gap-2"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Users size={14} className="text-white/70" />
                              <span className="text-white/90 font-medium">{team.playersCount} players</span>
                            </motion.div>
                          )}

                          {team.manager && (
                            <motion.div
                              className="flex items-center gap-2"
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{team.manager.charAt(0)}</span>
                              </div>
                              <span className="text-white/90 font-medium">{team.manager}</span>
                            </motion.div>
                          )}
                        </div>

                        {/* Ultra Sparkle Effects */}
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.8, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                          className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
                        />

                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.2, 0.6, 0.2]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.7
                          }}
                          className="absolute bottom-4 right-4 w-2 h-2 bg-pink-400 rounded-full shadow-lg"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </DashboardLayout>

        {/* Modals */}
        <TeamModal
          isOpen={activeModal === 'create'}
          onClose={() => setActiveModal(null)}
          title="Create New Team"
          mode="create"
          league={userLeague}
          setActiveModal={setActiveModal}
        />

        <TeamModal
          isOpen={activeModal === 'edit'}
          onClose={() => {
            setActiveModal(null);
            setSelectedTeam(null);
          }}
          title="Edit Team"
          mode="edit"
          existingTeam={selectedTeam}
          league={userLeague}
          setActiveModal={setActiveModal}
        />

        <TeamModal
          isOpen={activeModal === 'add-existing'}
          onClose={() => setActiveModal(null)}
          title="Add Existing Team"
          mode="add-existing"
          league={userLeague}
          setActiveModal={setActiveModal}
        />

        {/* Club Admin Modals */}
        <ClubAdminModal
          isOpen={activeModal === 'manage-club-admins'}
          onClose={() => setActiveModal(null)}
          title="Manage Club Admins"
          mode="manage"
          setActiveModal={setActiveModal}
          league={userLeague}
        />

        <ClubAdminModal
          isOpen={activeModal === 'select-club-admin'}
          onClose={() => setActiveModal(null)}
          title="Select Club Admin"
          mode="select"
          team={selectedTeam}
          onClubAdminChange={async (admin) => {
            if (selectedTeam) {
              try {
                await updateTeam(selectedTeam._id, { clubAdmin: admin._id });
                // Update the selected team with the new club admin
                const updatedTeam = { ...selectedTeam, clubAdmin: admin };
                setSelectedTeam(updatedTeam);
              } catch (error: any) {
                alert(`Failed to assign club admin: ${error.message}`);
              }
            }
          }}
          setActiveModal={setActiveModal}
          league={userLeague}
        />

        <ClubAdminModal
          isOpen={activeModal === 'create-club-admin'}
          onClose={() => setActiveModal(null)}
          title="Create New Club Admin"
          mode="create"
          team={selectedTeam}
          onClubAdminChange={async (admin) => {
            if (selectedTeam) {
              try {
                await updateTeam(selectedTeam._id, { clubAdmin: admin._id });
                // Update the selected team with the new club admin
                const updatedTeam = { ...selectedTeam, clubAdmin: admin };
                setSelectedTeam(updatedTeam);
              } catch (error: any) {
                alert(`Failed to assign club admin: ${error.message}`);
              }
            }
          }}
          setActiveModal={setActiveModal}
          league={userLeague}
        />
      </div>
    </ProtectedRoute>
  );
}

const ClubAdminModal = ({
  isOpen,
  onClose,
  title,
  mode, // 'manage', 'select', 'create'
  team,
  onClubAdminChange,
  setActiveModal,
  onFormDataChange,
  league,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  mode: 'manage' | 'select' | 'create';
  team?: any;
  onClubAdminChange?: (clubAdmin: any) => void;
  setActiveModal: (modal: string | null) => void;
  onFormDataChange?: (clubAdmin: any) => void;
  league?: any;
}) => {
  const [activeTab, setActiveTab] = useState<'select' | 'create'>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClubAdmin, setSelectedClubAdmin] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { users, createUser, updateTeam, fetchUsers, updateUser } = useAppStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    phone: '',
  });

  // Filter club admins
  const clubAdmins = users.filter(user => user.role === 'club-admin');

  const filteredClubAdmins = clubAdmins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignClubAdmin = async () => {
    if (!selectedClubAdmin) return;

    if (team) {
      // Update existing team
      setIsSubmitting(true);
      try {
        await updateTeam(team._id, { clubAdmin: selectedClubAdmin._id });
        // Also update the user's team field
        await updateUser(selectedClubAdmin._id, { teamId: team._id });
        onClubAdminChange?.(selectedClubAdmin);
        onClose();
      } catch (error: any) {
        alert(`Failed to assign club admin: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Update form data for new team creation
      onFormDataChange?.(selectedClubAdmin);
      onClose();
    }
  };

  const handleCreateClubAdmin = async () => {
    if (!formData.username || !formData.email || !formData.name || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const userData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'club-admin',
        organizationId: team?.organization?._id || team?.organization || league?.organization?._id || league?.organization,
      };

      const newUser = await createUser(userData);
      await fetchUsers(); // Refresh the users list
      
      if (team) {
        await updateTeam(team._id, { clubAdmin: newUser._id });
        // Set the team field on the newly created user
        await updateUser(newUser._id, { teamId: team._id });
        onClubAdminChange?.(newUser);
      } else {
        // For new team creation, select the newly created admin
        setSelectedClubAdmin(newUser);
        setActiveTab('select');
        // Don't close the modal, let user assign it
        return;
      }
      
      onClose();
    } catch (error: any) {
      alert(`Failed to create club admin: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'manage') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-accent/20 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Existing Club Admins */}
                <div>
                  <h4 className="text-md font-semibold mb-4">Existing Club Admins</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {clubAdmins.map((admin) => (
                      <div
                        key={admin._id}
                        className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-accent">
                              {admin.name?.charAt(0) || admin.username.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{admin.name || admin.username}</p>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                          Club Admin
                        </span>
                      </div>
                    ))}
                    {clubAdmins.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No club admins found</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-md font-semibold mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        onClose();
                        setActiveModal('select-club-admin');
                      }}
                      className="w-full p-4 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users size={20} className="text-accent" />
                        <div>
                          <p className="font-medium">Assign to Team</p>
                          <p className="text-sm text-muted-foreground">Select existing club admin for a team</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        setActiveModal('create-club-admin');
                      }}
                      className="w-full p-4 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 rounded-lg text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Plus size={20} className="text-secondary" />
                        <div>
                          <p className="font-medium">Create New Club Admin</p>
                          <p className="text-sm text-muted-foreground">Add a new club administrator</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (mode === 'select') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-accent/20 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    placeholder="Search club admins by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  />
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredClubAdmins.map((admin) => (
                    <div
                      key={admin._id}
                      className={`flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors cursor-pointer ${
                        selectedClubAdmin?._id === admin._id ? 'ring-2 ring-accent' : ''
                      }`}
                      onClick={() => setSelectedClubAdmin(admin)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <span className="text-accent font-bold">
                            {admin.name?.charAt(0) || admin.username.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{admin.name || admin.username}</p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                      </div>
                      {selectedClubAdmin?._id === admin._id && <Check size={20} className="text-accent" />}
                    </div>
                  ))}
                  {filteredClubAdmins.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No club admins found</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={onClose} className="px-4 py-2 bg-card hover:bg-card/80 border border-border rounded-lg">
                  Cancel
                </button>
                <button
                  onClick={handleAssignClubAdmin}
                  disabled={!selectedClubAdmin || isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-accent to-secondary text-accent-foreground font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Assigning...' : 'Assign Club Admin'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Create mode
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-accent/20 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button onClick={onClose} className="px-4 py-2 bg-card hover:bg-card/80 border border-border rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleCreateClubAdmin}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-accent to-secondary text-accent-foreground font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Club Admin'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
