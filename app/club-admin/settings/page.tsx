'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Key,
  Mail,
  Phone
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/club-admin', icon: <User size={20} /> },
  { label: 'Team Profile', href: '/club-admin/profile', icon: <User size={20} /> },
  { label: 'Players', href: '/club-admin/players', icon: <User size={20} /> },
  { label: 'Matches', href: '/club-admin/matches', icon: <User size={20} /> },
  { label: 'Statistics', href: '/club-admin/stats', icon: <User size={20} /> },
  { label: 'Settings', href: '/club-admin/settings', icon: <Settings size={20} /> },
];

export default function ClubAdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const { user, teams } = useAppStore();

  // Get the team that this club admin manages
  const userTeam = teams.find(team => {
    const clubAdminId = typeof team.clubAdmin === 'object' ? team.clubAdmin?._id : team.clubAdmin;
    return clubAdminId === user?._id;
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  if (!userTeam) {
    return (
      <ProtectedRoute requiredRole="club-admin">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center glass-card p-8 rounded-2xl max-w-md mx-4">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Team Not Assigned</h2>
            <p className="text-muted-foreground mb-6">
              You haven't been assigned to manage a team yet.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="club-admin">
      <div className="min-h-screen bg-background text-foreground">
        <GradientBackground />

        <DashboardLayout
          title="Club Admin"
          headerTitle="Settings"
          headerDescription="Manage your account preferences and team settings"
          navItems={navItems}
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Settings Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex gap-2 mb-6">
                {[
                  { key: 'profile', label: 'Profile', icon: <User size={18} /> },
                  { key: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
                  { key: 'security', label: 'Security', icon: <Shield size={18} /> },
                  { key: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === tab.key
                        ? 'bg-accent text-accent-foreground shadow-lg'
                        : 'bg-card hover:bg-card/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.name || ''}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                          type="text"
                          defaultValue={user?.username || ''}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                          placeholder="Enter your username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted rounded-l-lg border border-r-0 border-border">
                            <Mail size={16} className="text-muted-foreground" />
                          </div>
                          <input
                            type="email"
                            defaultValue={user?.email || ''}
                            className="flex-1 px-4 py-2 bg-background border border-border rounded-r-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted rounded-l-lg border border-r-0 border-border">
                            <Phone size={16} className="text-muted-foreground" />
                          </div>
                          <input
                            type="tel"
                            defaultValue={user?.phone || ''}
                            className="flex-1 px-4 py-2 bg-background border border-border rounded-r-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4">Team Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Team Name</label>
                        <input
                          type="text"
                          defaultValue={userTeam?.name || ''}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                          readOnly
                        />
                        <p className="text-xs text-muted-foreground mt-1">Team name cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <input
                          type="text"
                          defaultValue="Club Administrator"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                      <div>
                        <h4 className="font-semibold">Match Notifications</h4>
                        <p className="text-sm text-muted-foreground">Get notified about upcoming matches and results</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                      <div>
                        <h4 className="font-semibold">Player Updates</h4>
                        <p className="text-sm text-muted-foreground">Receive updates about player status and injuries</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                      <div>
                        <h4 className="font-semibold">League Announcements</h4>
                        <p className="text-sm text-muted-foreground">Important league news and announcements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                      <div>
                        <h4 className="font-semibold">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold mb-4">Security Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Current Password</label>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-muted rounded-l-lg border border-r-0 border-border">
                              <Key size={16} className="text-muted-foreground" />
                            </div>
                            <input
                              type="password"
                              className="flex-1 px-4 py-2 bg-background border border-border rounded-r-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                              placeholder="Enter current password"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">New Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                        <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="h-px bg-border"></div>

                    <div>
                      <h4 className="font-semibold mb-3 text-red-400">Danger Zone</h4>
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <h5 className="font-semibold mb-2">Request Account Deletion</h5>
                        <p className="text-sm text-muted-foreground mb-4">
                          This action will permanently delete your account and remove you as club administrator.
                          This cannot be undone.
                        </p>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                          Request Deletion
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold mb-4">Appearance Preferences</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Theme</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                          <div className="w-full h-16 bg-white border rounded mb-2"></div>
                          <p className="text-sm font-medium text-center">Light</p>
                        </div>
                        <div className="p-4 border-2 border-accent rounded-lg cursor-pointer">
                          <div className="w-full h-16 bg-gray-900 border rounded mb-2"></div>
                          <p className="text-sm font-medium text-center">Dark</p>
                        </div>
                        <div className="p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors opacity-50">
                          <div className="w-full h-16 bg-gradient-to-r from-blue-400 to-purple-600 rounded mb-2"></div>
                          <p className="text-sm font-medium text-center">Auto</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Language</h4>
                      <select className="w-full max-w-xs px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none">
                        <option value="en">English</option>
                        <option value="am">አማርኛ (Amharic)</option>
                        <option value="om">Oromo</option>
                        <option value="ti">ትግርኛ (Tigrinya)</option>
                      </select>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Dashboard Layout</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="radio" name="layout" defaultChecked className="text-accent" />
                          <div>
                            <p className="font-medium">Compact</p>
                            <p className="text-sm text-muted-foreground">Show more information in less space</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="radio" name="layout" className="text-accent" />
                          <div>
                            <p className="font-medium">Comfortable</p>
                            <p className="text-sm text-muted-foreground">More spacing and larger elements</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6">
                <motion.button
                  onClick={handleSave}
                  disabled={isSaving}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
