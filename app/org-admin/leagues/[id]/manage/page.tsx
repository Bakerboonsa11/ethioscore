'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
  Trophy,
  ArrowLeft,
  Users,
  Settings,
  UserPlus,
  Shield,
  Flag,
  Calendar,
  MapPin,
  Edit,
  Plus,
  MoreHorizontal,
  X,
  Search,
  Check,
  Mail,
  Phone
} from 'lucide-react';

const StaffModal = ({
  isOpen,
  onClose,
  title,
  icon,
  type,
  league,
  existingAdmin,
  onAdminChange,
  role = 'league-admin'
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  type: 'admin' | 'event-admin' | 'referee' | 'staff';
  league: League;
  existingAdmin?: User | null;
  onAdminChange?: (admin: User | null) => void;
  role?: string;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'existing' | 'create'>('existing');
  const [createFormData, setCreateFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { users, user } = useAppStore();

  // Initialize form data when editing existing admin
  useEffect(() => {
    if (existingAdmin && type === 'admin') {
      setCreateFormData({
        name: existingAdmin.email.split('@')[0] || '', // Use email prefix as name
        username: existingAdmin.username,
        email: existingAdmin.email,
        password: '', // Don't populate password for security
      });
      setActiveTab('create'); // Switch to create tab for editing
    }
  }, [existingAdmin, type]);

  const filteredUsers = users.filter((user): user is User & Required<Pick<User, '_id'>> =>
    user._id != null && user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine role filter based on type
  let roleFilter: string | undefined;
  if (type === 'admin') roleFilter = 'league-admin';
  else if (type === 'event-admin') roleFilter = 'event-admin';
  else if (type === 'referee') roleFilter = 'referee';
  // For 'staff', no role filter

  const roleFilteredUsers = filteredUsers.filter(user => !roleFilter || user.role === roleFilter);

  const handleAddStaff = async () => {
    if (selectedUsers.length === 0) return;

    // For admin type, we need to update the user's role and league
    if (type === 'admin') {
      try {
        // Check if league already has an admin by calling the API
        const response = await fetch(`/api/users?role=${role}&leagueId=${league._id || league.id}`);
        if (!response.ok) {
          throw new Error('Failed to check existing admins');
        }
        const existingAdmins = await response.json();

        if (existingAdmins.length > 0) {
          alert(`A ${role.replace('-', ' ')} already exists for this league. You can update or remove the existing admin instead.`);
          return;
        }

        // Update the selected user to be an admin
        const userId = selectedUsers[0]; // Only allow one admin per league
        const updateResponse = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: role,
            league: league._id || league.id,
          }),
        });

        if (!updateResponse.ok) {
          const error = await updateResponse.json();
          throw new Error(error.error);
        }

        const updatedUser = await updateResponse.json();
        console.log(`Assigned ${role}:`, updatedUser);

        // Update state and refresh users list
        onAdminChange?.(updatedUser.user);
        await fetchUsers();

        onClose();
      } catch (error: any) {
        alert(`Failed to assign ${role.replace('-', ' ')}: ${error.message}`);
      }
    } else if (type === 'event-admin') {
      try {
        // Check if league already has an event-admin by calling the API
        const response = await fetch(`/api/users?role=event-admin&leagueId=${league._id || league.id}`);
        if (!response.ok) {
          throw new Error('Failed to check existing event-admins');
        }
        const existingAdmins = await response.json();

        if (existingAdmins.length > 0) {
          alert(`An event admin already exists for this league. You can update or remove the existing admin instead.`);
          return;
        }

        // Update the selected user to be an event-admin
        const userId = selectedUsers[0]; // Only allow one event-admin per league
        const updateResponse = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'event-admin',
            league: league._id || league.id,
          }),
        });

        if (!updateResponse.ok) {
          const error = await updateResponse.json();
          throw new Error(error.error);
        }

        const updatedUser = await updateResponse.json();
        console.log(`Assigned event-admin:`, updatedUser);

        // Update state and refresh users list
        onAdminChange?.(updatedUser.user);
        await fetchUsers();

        onClose();
      } catch (error: any) {
        alert(`Failed to assign event admin: ${error.message}`);
      }
    } else if (type === 'referee') {
      try {
        // Assign multiple referees to the league
        const updatePromises = selectedUsers.map(async (userId) => {
          const updateResponse = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              role: 'referee',
              league: league._id || league.id,
            }),
          });

          if (!updateResponse.ok) {
            const error = await updateResponse.json();
            throw new Error(`Failed to assign referee ${userId}: ${error.error}`);
          }

          return updateResponse.json();
        });

        const results = await Promise.all(updatePromises);
        console.log(`Assigned referees:`, results);

        // Refresh users list
        await fetchUsers();

        onClose();
      } catch (error: any) {
        alert(`Failed to assign referees: ${error.message}`);
      }
    } else {
      // TODO: Implement logic for other staff types
      console.log(`Adding ${type} staff:`, selectedUsers);
      onClose();
    }
  };

  const handleCreateUser = async () => {
    if (!createFormData.username || !createFormData.email || !createFormData.password) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createFormData,
          organizationId: league.organization._id || league.organization,
          leagueId: league._id || league.id,
          role: role,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const { user: newUser } = await response.json();
      console.log('Created new user:', newUser);

      // Set the new admin in state
      onAdminChange?.(newUser);

      // Reset form and close modal
      setCreateFormData({ name: '', username: '', email: '', password: '' });
      onClose();
    } catch (error: any) {
      alert(`Failed to create user: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!existingAdmin || !createFormData.username || !createFormData.email) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUpdating(true);
    try {
      const updateData: any = {
        username: createFormData.username,
        email: createFormData.email,
      };

      // Only update password if provided
      if (createFormData.password) {
        updateData.password = createFormData.password;
      }

      const response = await fetch(`/api/users/${existingAdmin._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const { user: updatedUser } = await response.json();
      console.log('Updated user:', updatedUser);

      // Update the existing admin in state
      onAdminChange?.(updatedUser);

      // Reset form and close modal
      setCreateFormData({ name: '', username: '', email: '', password: '' });
      onClose();
    } catch (error: any) {
      alert(`Failed to update user: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveUser = async () => {
    if (!existingAdmin) return;

    const roleName = role.replace('-', ' ');
    if (!confirm(`Are you sure you want to remove this ${roleName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${existingAdmin._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      console.log('Removed user:', existingAdmin._id);

      // Clear the existing admin from state
      onAdminChange?.(null);

      onClose();
    } catch (error: any) {
      alert(`Failed to remove user: ${error.message}`);
    }
  };

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
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {icon}
                <h3 className="text-lg font-bold">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs - only show if not editing existing admin */}
            {!existingAdmin && (
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('existing')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'existing'
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Select Existing
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'create'
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Create New
                </button>
              </div>
            )}

            <div className="space-y-4">
              {existingAdmin ? (
                // Edit existing admin
                <>
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <h4 className="font-semibold mb-2">Current {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Username:</strong> {existingAdmin.username}</p>
                      <p><strong>Email:</strong> {existingAdmin.email}</p>
                      <p><strong>Role:</strong> {existingAdmin.role}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Update {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Details</h4>
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={createFormData.name}
                        onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Username</label>
                      <input
                        type="text"
                        value={createFormData.username}
                        onChange={(e) => setCreateFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter username"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={createFormData.email}
                        onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password (optional)</label>
                      <input
                        type="password"
                        value={createFormData.password}
                        onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Leave empty to keep current password"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : activeTab === 'existing' ? (
                // Select existing users (only when not editing)
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {roleFilteredUsers.map((user) => {
                      const userId = user._id as string;
                      return (
                        <div
                          key={userId}
                          className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">{user.email.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-medium">{user.email}</p>
                              <p className="text-sm text-muted-foreground">{user.username}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedUsers(prev =>
                                prev.includes(userId)
                                  ? prev.filter(id => id !== userId)
                                  : [...prev, userId]
                              );
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              selectedUsers.includes(userId)
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-card hover:bg-card/80 border border-border'
                            }`}
                          >
                            {selectedUsers.includes(userId) ? <Check size={16} /> : <Plus size={16} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                // Create new user (only when not editing)
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={createFormData.name}
                        onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Username</label>
                      <input
                        type="text"
                        value={createFormData.username}
                        onChange={(e) => setCreateFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter username"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={createFormData.email}
                        onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <input
                        type="password"
                        value={createFormData.password}
                        onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-card hover:bg-card/80 border border-border rounded-lg transition-colors"
              >
                Cancel
              </button>

              {existingAdmin ? (
                // Edit existing admin buttons
                <>
                  <button
                    onClick={handleRemoveUser}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
                  >
                    Remove {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                  <button
                    onClick={handleUpdateUser}
                    disabled={isUpdating || !createFormData.username || !createFormData.email}
                    className="px-4 py-2 bg-gradient-to-r from-accent to-secondary text-accent-foreground font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Updating...' : `Update ${role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                  </button>
                </>
              ) : (
                // Create new or select existing buttons
                <button
                  onClick={activeTab === 'existing' ? handleAddStaff : handleCreateUser}
                  disabled={activeTab === 'existing' ? selectedUsers.length === 0 : isCreating || !createFormData.username || !createFormData.email || !createFormData.password}
                  className="px-4 py-2 bg-gradient-to-r from-accent to-secondary text-accent-foreground font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activeTab === 'existing' ? `Add Staff (${selectedUsers.length})` : (isCreating ? 'Creating...' : 'Create User')}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function ManageLeaguePage() {
  const [existingLeagueAdmin, setExistingLeagueAdmin] = useState<User | null>(null);
  const [existingEventAdmin, setExistingEventAdmin] = useState<User | null>(null);

  const router = useRouter();
  const params = useParams();
  const leagueId = params.id as string;
  const { leagues, users, user, fetchUsers } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const league = leagues.find(l => l._id === leagueId || l.id === leagueId);

  useEffect(() => {
    const loadData = async () => {
      if (!users.length) {
        await fetchUsers();
      }
      
      // Check if league already has admins
      const leagueAdmin = users.find(u => u.role === 'league-admin' && u.league?._id === leagueId);
      const eventAdmin = users.find(u => u.role === 'event-admin' && u.league?._id === leagueId);
      setExistingLeagueAdmin(leagueAdmin || null);
      setExistingEventAdmin(eventAdmin || null);
      
      setIsLoading(false);
    };
    loadData();
  }, [fetchUsers, users.length, leagueId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading league management...</p>
        </div>
      </div>
    );
  }

  if (!league) {
    return (
      <ProtectedRoute requiredRole="org-admin">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">League Not Found</h2>
            <p className="text-muted-foreground mb-6">The league you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/org-admin/leagues')}
              className="px-6 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Back to Leagues
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'league': return '🏆';
      case 'knockout': return '🏅';
      case 'group_stage': return '🎯';
      default: return '🏆';
    }
  };

  return (
    <ProtectedRoute requiredRole="org-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-3">
                    <Settings className="text-accent" size={28} />
                    Manage League
                  </h1>
                  <p className="text-muted-foreground">Manage {league.name} settings and staff</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(league.status)}`}>
                  {league.status}
                </span>
                <button
                  onClick={() => router.push(`/org-admin/leagues/${leagueId}/edit`)}
                  className="px-4 py-2 bg-card hover:bg-card/80 border border-border rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit League
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* League Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* League Overview */}
              <div className="glass-card p-8 rounded-2xl">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center text-4xl">
                    {getFormatIcon(league.type.format)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{league.name}</h2>
                    <div className="flex items-center gap-6 text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar size={18} />
                        {league.year}
                      </span>
                      {league.region && (
                        <span className="flex items-center gap-2">
                          <MapPin size={18} />
                          {league.region}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1">{league.type.format.replace('_', ' ')}</div>
                    <div className="text-sm text-muted-foreground">Format</div>
                  </div>
                  {league.tier && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">{league.tier}</div>
                      <div className="text-sm text-muted-foreground">Tier</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1">{league.type.hasHomeAway ? 'Yes' : 'No'}</div>
                    <div className="text-sm text-muted-foreground">Home & Away</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1 capitalize">{league.status}</div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>

                {league.socialMedia && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-semibold mb-3">Social Media</h3>
                    <div className="flex gap-4">
                      {league.socialMedia.facebook && (
                        <a href={league.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                           className="text-blue-500 hover:text-blue-600 transition-colors">
                          Facebook
                        </a>
                      )}
                      {league.socialMedia.twitter && (
                        <a href={league.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                           className="text-blue-400 hover:text-blue-500 transition-colors">
                          Twitter
                        </a>
                      )}
                      {league.socialMedia.instagram && (
                        <a href={league.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                           className="text-pink-500 hover:text-pink-600 transition-colors">
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Staff Management Placeholder */}
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Users size={24} className="text-accent" />
                  League Staff
                </h3>
                <div className="text-center py-12 text-muted-foreground">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Staff management features coming soon</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      // Always do a fresh check when button is clicked
                      try {
                        const response = await fetch(`/api/users?role=league-admin&leagueId=${league._id || league.id}`);
                        if (response.ok) {
                          const existingAdmins = await response.json();
                          if (existingAdmins.length > 0) {
                            // Admin exists, show the edit modal
                            setExistingLeagueAdmin(existingAdmins[0]);
                            setActiveModal('admin');
                          } else {
                            // No admin exists, show creation modal
                            setExistingLeagueAdmin(null);
                            setActiveModal('admin');
                          }
                        } else {
                          // Error checking, default to creation modal
                          setExistingLeagueAdmin(null);
                          setActiveModal('admin');
                        }
                      } catch (error) {
                        // Error checking, default to creation modal
                        setExistingLeagueAdmin(null);
                        setActiveModal('admin');
                      }
                    }}
                    className="w-full p-4 bg-gradient-to-r from-accent to-secondary text-accent-foreground font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-3"
                  >
                    {existingLeagueAdmin ? <Edit size={20} /> : <UserPlus size={20} />}
                    <span>{existingLeagueAdmin ? 'Edit League Admin' : 'Add League Admin'}</span>
                  </button>

                  <button
                    onClick={async () => {
                      // Always do a fresh check when button is clicked
                      try {
                        const response = await fetch(`/api/users?role=event-admin&leagueId=${league._id || league.id}`);
                        if (response.ok) {
                          const existingAdmins = await response.json();
                          if (existingAdmins.length > 0) {
                            // Admin exists, show the edit modal
                            setExistingEventAdmin(existingAdmins[0]);
                            setActiveModal('event-admin');
                          } else {
                            // No admin exists, show creation modal
                            setExistingEventAdmin(null);
                            setActiveModal('event-admin');
                          }
                        } else {
                          // Error checking, default to creation modal
                          setExistingEventAdmin(null);
                          setActiveModal('event-admin');
                        }
                      } catch (error) {
                        // Error checking, default to creation modal
                        setExistingEventAdmin(null);
                        setActiveModal('event-admin');
                      }
                    }}
                    className="w-full p-4 bg-card hover:bg-card/80 border border-border rounded-xl transition-colors flex items-center gap-3"
                  >
                    <Shield size={20} className="text-blue-500" />
                    <span>{existingEventAdmin ? 'Edit Event Admin' : 'Add Event Admin'}</span>
                  </button>

                  <button
                    onClick={() => setActiveModal('referee')}
                    className="w-full p-4 bg-card hover:bg-card/80 border border-border rounded-xl transition-colors flex items-center gap-3"
                  >
                    <Flag size={20} className="text-orange-500" />
                    <span>Manage Referees</span>
                  </button>

                  <button
                    onClick={() => setActiveModal('staff')}
                    className="w-full p-4 bg-card hover:bg-card/80 border border-border rounded-xl transition-colors flex items-center gap-3"
                  >
                    <Users size={20} className="text-green-500" />
                    <span>Manage Other Staff</span>
                  </button>
                </div>
              </div>

              {/* League Stats */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4">League Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Teams</span>
                    <span className="font-semibold">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Matches</span>
                    <span className="font-semibold">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Staff</span>
                    <span className="font-semibold">-</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modals */}
        <StaffModal
          isOpen={activeModal === 'admin'}
          onClose={() => setActiveModal(null)}
          title={existingLeagueAdmin ? "Edit League Admin" : "Add League Admin"}
          icon={<UserPlus size={24} className="text-accent" />}
          type="admin"
          league={league}
          existingAdmin={existingLeagueAdmin}
          onAdminChange={setExistingLeagueAdmin}
        />

        <StaffModal
          isOpen={activeModal === 'event-admin'}
          onClose={() => setActiveModal(null)}
          title={existingEventAdmin ? "Edit Event Admin" : "Add Event Admin"}
          icon={<Shield size={24} className="text-blue-500" />}
          type="event-admin"
          league={league}
          existingAdmin={existingEventAdmin}
          onAdminChange={setExistingEventAdmin}
          role="event-admin"
        />

        <StaffModal
          isOpen={activeModal === 'referee'}
          onClose={() => setActiveModal(null)}
          title="Manage Referees"
          icon={<Flag size={24} className="text-orange-500" />}
          type="referee"
          league={league}
        />

        <StaffModal
          isOpen={activeModal === 'staff'}
          onClose={() => setActiveModal(null)}
          title="Manage Other Staff"
          icon={<Users size={24} className="text-green-500" />}
          type="staff"
          league={league}
        />
      </div>
    </ProtectedRoute>
  );
}
