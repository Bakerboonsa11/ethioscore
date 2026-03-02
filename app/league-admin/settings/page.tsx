'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings, Save, Bell, Shield, Palette, Globe, Trophy, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { GradientBackground } from '@/components/dashboard/gradient-background';
import { useAppStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/auth/protected-route';

const navItems = [
  { label: 'Overview', href: '/league-admin', icon: <Trophy size={20} /> },
  { label: 'Teams', href: '/league-admin/teams', icon: <Users size={20} /> },
  { label: 'Matches', href: '/league-admin/matches', icon: <Trophy size={20} /> },
  { label: 'Referees', href: '/league-admin/referees', icon: <Shield size={20} /> },
  { label: 'Settings', href: '/league-admin/settings', icon: <Settings size={20} /> },
];

export default function LeagueAdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { user, leagues } = useAppStore();

  // Get the league that this admin manages
  const userLeague = leagues.find(league =>
    league._id === user?.league?._id || league.id === user?.league?.id
  );

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      matchReminders: true,
      teamUpdates: true,
      refereeAssignments: false,
      leagueAnnouncements: true,
    },
    league: {
      autoSchedule: false,
      publicVisibility: true,
      allowSpectators: true,
      requireReferees: true,
    },
    display: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    // Show success message
    alert('Settings saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
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
          headerTitle="League Settings"
          headerDescription={`Configure settings for ${userLeague.name}`}
          navItems={navItems}
          headerActions={
            <motion.button
              onClick={handleSaveSettings}
              disabled={isSaving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </motion.button>
          }
        >
          <div className="space-y-8">
            {/* League Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center text-4xl">
                  ⚙️
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">League Configuration</h2>
                  <p className="text-muted-foreground">
                    Manage your league's settings, notifications, and preferences
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <Bell className="text-blue-500" size={24} />
                <h3 className="text-xl font-bold">Notification Preferences</h3>
              </div>
              <div className="glass-card p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Match Reminders</h4>
                    <p className="text-sm text-muted-foreground">Get notified before scheduled matches</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.matchReminders}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, matchReminders: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Team Updates</h4>
                    <p className="text-sm text-muted-foreground">Notifications about team changes and registrations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.teamUpdates}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, teamUpdates: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Referee Assignments</h4>
                    <p className="text-sm text-muted-foreground">Alerts when referees are assigned to matches</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.refereeAssignments}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, refereeAssignments: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">League Announcements</h4>
                    <p className="text-sm text-muted-foreground">Important league-wide announcements and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.leagueAnnouncements}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, leagueAnnouncements: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* League Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="text-green-500" size={24} />
                <h3 className="text-xl font-bold">League Configuration</h3>
              </div>
              <div className="glass-card p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Auto Schedule Matches</h4>
                    <p className="text-sm text-muted-foreground">Automatically schedule matches based on team availability</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.league.autoSchedule}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        league: { ...prev.league, autoSchedule: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Public League</h4>
                    <p className="text-sm text-muted-foreground">Make league information visible to the public</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.league.publicVisibility}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        league: { ...prev.league, publicVisibility: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Allow Spectators</h4>
                    <p className="text-sm text-muted-foreground">Enable spectator mode for matches</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.league.allowSpectators}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        league: { ...prev.league, allowSpectators: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Require Referees</h4>
                    <p className="text-sm text-muted-foreground">Mandate referee assignment for all matches</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.league.requireReferees}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        league: { ...prev.league, requireReferees: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Display Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <Palette className="text-purple-500" size={24} />
                <h3 className="text-xl font-bold">Display & Preferences</h3>
              </div>
              <div className="glass-card p-6 rounded-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <select
                      value={settings.display.theme}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, theme: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select
                      value={settings.display.language}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, language: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <select
                      value={settings.display.timezone}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        display: { ...prev.display, timezone: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">Greenwich Mean Time</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
